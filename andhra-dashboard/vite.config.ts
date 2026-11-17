import { defineConfig, createLogger, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

const logger = createLogger();
const originalInfo = logger.info;
logger.info = (msg, options) => {
  if (msg.includes('Local')) {
    console.log(msg.trim());
    return;
  }
  // Suppress startup banners, Network hints, and shortcut help
  if (
    msg.includes('VITE') ||
    msg.includes('Network') ||
    msg.includes('shortcuts') ||
    msg.includes('press h') ||
    !msg.trim()
  ) {
    return;
  }
  originalInfo(msg, options);
};

function onDemandExtractorPlugin(): Plugin {
  return {
    name: 'on-demand-extractor-api',
    configureServer(server) {
      // 1. Directly serve voter roll and survey JSON files from disk (bypassing Vite SPA index.html fallback)
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.startsWith('/data/voters/') || req.url.startsWith('/data/surveys/'))) {
          const cleanUrl = req.url.split('?')[0];
          const filePath = path.resolve(import.meta.dirname, 'public' + cleanUrl);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            });
            return res.end(fs.readFileSync(filePath));
          }
        }
        next();
      });

      // 2. Handle on-demand extraction API
      server.middlewares.use('/api/extract-booth', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          });
          return res.end();
        }

        const url = new URL(req.url || '', `http://${req.headers.host}`);

        // Handle GET status check
        if (req.method === 'GET') {
          const ac = url.searchParams.get('ac');
          const booth = url.searchParams.get('booth');
          if (!ac || !booth) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Missing ac or booth query parameter' }));
          }

          const targetFile = path.resolve(import.meta.dirname, `public/data/voters/ac_${ac}/booth_${booth}.json`);
          const exists = fs.existsSync(targetFile);
          let summary = null;
          if (exists) {
            try {
              const content = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
              summary = {
                acNo: content.acNo,
                boothNo: content.boothNo,
                totalElectors: content.totalElectors,
                totalPages: content.totalPages,
                rollSource: content.roll_source,
                isAuthenticExtract: true
              };
            } catch {
              // file being written or corrupt
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ exists, summary }));
        }

        // Handle POST trigger extraction
        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => { bodyStr += chunk; });
          req.on('end', () => {
            let body: any = {};
            try {
              body = JSON.parse(bodyStr);
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Invalid JSON request body' }));
            }

            const { ac, booth, state = 'S01', force = false, mode = 'booth', workers = 10, stream = false } = body;
            const isStream = stream || url.searchParams.get('stream') === 'true';

            if (!ac) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Missing ac parameter' }));
            }

            if (mode === 'booth' && !booth) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Missing booth parameter' }));
            }

            const targetFile = booth ? path.resolve(import.meta.dirname, `public/data/voters/ac_${ac}/booth_${booth}.json`) : null;
            if (!force && targetFile && fs.existsSync(targetFile) && !isStream) {
              try {
                const existing = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                  success: true,
                  alreadyExtracted: true,
                  data: {
                    acNo: existing.acNo,
                    boothNo: existing.boothNo,
                    totalElectors: existing.totalElectors,
                    totalPages: existing.totalPages,
                    roll_source: existing.roll_source,
                    isAuthenticExtract: true
                  }
                }));
              } catch {
                // re-run if corrupt
              }
            }

            const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
            let scriptPath = '';
            let args: string[] = [];

            if (mode === 'ac') {
              const candidatePaths = [
                path.resolve(import.meta.dirname, 'scripts/extract_ac_all_booths.py'),
                path.resolve(import.meta.dirname, '../scripts/extract_ac_all_booths.py')
              ];
              scriptPath = candidatePaths.find(p => fs.existsSync(p)) || candidatePaths[0];
              args = [scriptPath, '--ac', String(ac), '--workers', String(workers)];
            } else {
              const candidatePaths = [
                path.resolve(import.meta.dirname, 'scripts/extract_booth_voters.py'),
                path.resolve(import.meta.dirname, '../andhra-pipeline-scripts/extract_booth_voters.py'),
                path.resolve(import.meta.dirname, '../scripts/extract_booth_voters.py')
              ];
              scriptPath = candidatePaths.find(p => fs.existsSync(p)) || candidatePaths[0];
              args = [
                scriptPath,
                '--ac', String(ac),
                '--booth', String(booth),
                '--state', String(state)
              ];
            }

            let stdoutData = '';
            let stderrData = '';

            const child = spawn(pythonCmd, args, {
              cwd: path.resolve(import.meta.dirname, '..'),
              env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUNBUFFERED: '1' }
            });

            if (isStream) {
              res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache, no-transform',
                'Access-Control-Allow-Origin': '*'
              });

              child.stdout.on('data', (chunk) => {
                const text = chunk.toString('utf-8');
                stdoutData += text;
                res.write(text);
              });

              child.stderr.on('data', (chunk) => {
                const text = chunk.toString('utf-8');
                stderrData += text;
                res.write(text);
              });

              child.on('close', (code) => {
                res.write(`\n__PROCESS_EXIT__ ${code}\n`);
                res.end();
              });
              return;
            }

            child.stdout.on('data', (data) => {
              stdoutData += data.toString('utf-8');
            });

            child.stderr.on('data', (data) => {
              stderrData += data.toString('utf-8');
            });

            child.on('close', (code) => {
              if (code !== 0) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                  success: false,
                  error: `Extractor process exited with code ${code}`,
                  stderr: stderrData,
                  stdout: stdoutData
                }));
              }

              // Extract json result marker
              const match = stdoutData.match(/__EXTRACT_RESULT__\s+([^\r\n]+)/);
              let parsedResult = null;
              if (match) {
                try {
                  parsedResult = JSON.parse(match[1]);
                } catch {
                  // ignore
                }
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({
                success: true,
                result: parsedResult,
                stdout: stdoutData
              }));
            });
          });
          return;
        }

        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  customLogger: logger,
  clearScreen: false,
  plugins: [
    react(),
    tailwindcss(),
    onDemandExtractorPlugin()
  ],
  server: {
    watch: {
      ignored: [
        '**/public/data/voters/**',
        '**/dist/**',
        '**/.git/**',
        '**/data_archive/**',
      ],
    },
  },
})
