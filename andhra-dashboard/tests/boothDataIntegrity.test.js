import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONSTITUENCY_MANDALS } from '../src/data/mandalData.ts';
import { FORM_20_URLS } from '../src/data/form20Urls.ts';
import { getOfficialSir2026PdfUrl } from '../src/data/voterRollService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const boothsDir = path.join(rootDir, 'public', 'data', 'booths');
const votersDir = path.join(rootDir, 'public', 'data', 'voters');

describe('Booth Voter Data & SIR 2026 PDF Integrity Test Suite', () => {
  // Test 1: Verify All 175 AC Files Exist
  it('should have all 175 AC booth JSON files present in public/data/booths', () => {
    for (let acNo = 1; acNo <= 175; acNo++) {
      const filePath = path.join(boothsDir, `ac_${acNo}.json`);
      assert.ok(
        fs.existsSync(filePath),
        `Missing booth file for AC #${acNo}: public/data/booths/ac_${acNo}.json`
      );
    }
  });

  // Test 2: Verify Total Statewide Booth Census & Monotonic Non-Duplicate Booth Numbering
  it('should verify all 45,791 booths statewide are accounted for with zero duplicate booth numbers', () => {
    let totalBoothsStatewide = 0;

    for (let acNo = 1; acNo <= 175; acNo++) {
      const filePath = path.join(boothsDir, `ac_${acNo}.json`);
      const booths = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      assert.ok(Array.isArray(booths), `AC #${acNo} booth data is not an array`);
      assert.ok(booths.length > 0, `AC #${acNo} has 0 booths`);

      totalBoothsStatewide += booths.length;

      const seen = new Set();
      let prevBoothNo = 0;
      booths.forEach((b) => {
        assert.ok(
          typeof b.booth_no === 'number' && b.booth_no > 0,
          `AC #${acNo} has invalid booth_no ${b.booth_no}`
        );
        assert.ok(
          !seen.has(b.booth_no),
          `AC #${acNo} contains duplicate booth_no ${b.booth_no}`
        );
        seen.add(b.booth_no);
        assert.ok(
          b.booth_no > prevBoothNo,
          `AC #${acNo} booth numbers not strictly increasing: ${b.booth_no} <= ${prevBoothNo}`
        );
        prevBoothNo = b.booth_no;
      });
    }

    assert.strictEqual(
      totalBoothsStatewide,
      45791,
      `Statewide booth total must equal 45,791 (all 175 ACs verified from live ECI ceilings), found ${totalBoothsStatewide}`
    );
  });

  // Test 3: Official SIR 2026 PDF Links Coverage & URL Precision on 100% of Booths
  it('should verify every booth has an official ECI / CEO Andhra Pradesh SIR 2026 PDF link', () => {
    let checkedUrls = 0;

    for (let acNo = 1; acNo <= 175; acNo++) {
      const filePath = path.join(boothsDir, `ac_${acNo}.json`);
      const booths = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (acNo === 175) {
        assert.strictEqual(booths.length, 294, `AC #175 Kuppam must have exactly 294 booths, found ${booths.length}`);
      }

      for (const b of booths) {
        const url = b.roll_2026_url || (b.roll_2026 && b.roll_2026.url);
        assert.ok(
          url,
          `Booth #${b.booth_no} in AC #${acNo} is missing official SIR 2026 roll URL`
        );

        // Canonical format check
        const expectedUrl = `https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/${acNo}/2026-EROLLGEN-S01-${acNo}-SIR-DraftRoll-Revision1-ENG-${b.booth_no}-WI.pdf`;
        assert.strictEqual(
          url,
          expectedUrl,
          `AC #${acNo} Booth #${b.booth_no} URL mismatch: got "${url}", expected "${expectedUrl}"`
        );

        // Verification of roll_2026 metadata if present
        if (b.roll_2026) {
          assert.strictEqual(
            b.roll_2026.status,
            'Available',
            `AC #${acNo} Booth #${b.booth_no} roll_2026 status is not "Available"`
          );
          assert.strictEqual(
            b.roll_2026.filename,
            `2026-EROLLGEN-S01-${acNo}-SIR-DraftRoll-Revision1-ENG-${b.booth_no}-WI.pdf`,
            `AC #${acNo} Booth #${b.booth_no} filename mismatch`
          );
          assert.ok(
            typeof b.roll_2026.pdf_pages === 'number' && b.roll_2026.pdf_pages > 0,
            `AC #${acNo} Booth #${b.booth_no} missing or invalid pdf_pages`
          );
        }

        checkedUrls++;
      }
    }

    assert.strictEqual(
      checkedUrls,
      45791,
      `All 45,791 booth URLs statewide must be validated, checked ${checkedUrls}`
    );
  });

  // Test 4: GPS Coordinates Bounds & Zero Coordinates statewide
  it('should verify all booths have valid GPS coordinates within Andhra Pradesh bounds', () => {
    for (let acNo = 1; acNo <= 175; acNo++) {
      const filePath = path.join(boothsDir, `ac_${acNo}.json`);
      const booths = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      for (const b of booths) {
        assert.ok(
          typeof b.lat === 'number' && !isNaN(b.lat),
          `AC #${acNo} Booth #${b.booth_no} missing or NaN lat`
        );
        assert.ok(
          typeof b.lng === 'number' && !isNaN(b.lng),
          `AC #${acNo} Booth #${b.booth_no} missing or NaN lng`
        );

        // Coordinates must be strictly within Andhra Pradesh geographic bounds
        // Latitude: ~12.5° N to 19.5° N
        // Longitude: ~76.5° E to 85.0° E
        assert.ok(
          b.lat >= 12.5 && b.lat <= 19.5,
          `AC #${acNo} Booth #${b.booth_no} lat ${b.lat} is outside Andhra Pradesh bounds [12.5, 19.5]`
        );
        assert.ok(
          b.lng >= 76.5 && b.lng <= 85.0,
          `AC #${acNo} Booth #${b.booth_no} lng ${b.lng} is outside Andhra Pradesh bounds [76.5, 85.0]`
        );
      }
    }
  });

  // Test 5: Mandal Integrity & No Phantom "ASSEMBLY MANDAL"
  it('should verify no booth has empty or phantom "ASSEMBLY MANDAL" names', () => {
    for (let acNo = 1; acNo <= 175; acNo++) {
      const filePath = path.join(boothsDir, `ac_${acNo}.json`);
      const booths = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      for (const b of booths) {
        assert.ok(b.mandal, `AC #${acNo} Booth #${b.booth_no} has empty mandal`);
        assert.ok(
          typeof b.mandal === 'string' && b.mandal.trim().length >= 2,
          `AC #${acNo} Booth #${b.booth_no} has invalid mandal: "${b.mandal}"`
        );
        assert.notStrictEqual(
          b.mandal.trim().toUpperCase(),
          'ASSEMBLY MANDAL',
          `AC #${acNo} Booth #${b.booth_no} contains phantom "ASSEMBLY MANDAL"`
        );
      }
    }
  });

  // Test 6: Booth Metadata & Electorate Sanity
  it('should verify booth names, buildings, and electorate counts are within valid ranges', () => {
    for (let acNo = 1; acNo <= 175; acNo++) {
      const filePath = path.join(boothsDir, `ac_${acNo}.json`);
      const booths = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      for (const b of booths) {
        assert.ok(
          b.name && b.name.trim().length > 0,
          `AC #${acNo} Booth #${b.booth_no} has empty name`
        );
        assert.ok(
          b.electorate && b.electorate >= 50 && b.electorate <= 3500,
          `AC #${acNo} Booth #${b.booth_no} electorate ${b.electorate} is out of realistic range [50, 3500]`
        );

        if (b.total_votes !== undefined) {
          assert.ok(
            b.total_votes >= 0,
            `AC #${acNo} Booth #${b.booth_no} total_votes cannot be negative: ${b.total_votes}`
          );
        }

        if (b.turnout_pct !== undefined) {
          assert.ok(
            b.turnout_pct >= 0 && b.turnout_pct <= 300,
            `AC #${acNo} Booth #${b.booth_no} turnout_pct ${b.turnout_pct} is out of range [0, 300]`
          );
        }
      }
    }
  });

  // Test 7: Authentic Extracted Rolls Quality Check (public/data/voters/)
  it('should verify all authentic extracted rolls have valid electors, EPICs, and gender totals', () => {
    if (!fs.existsSync(votersDir)) return;

    const acDirs = fs.readdirSync(votersDir);
    let checkedExtractedFiles = 0;

    for (const acDir of acDirs) {
      const acPath = path.join(votersDir, acDir);
      if (!fs.statSync(acPath).isDirectory()) continue;

      const boothFiles = fs.readdirSync(acPath).filter((f) => f.endsWith('.json'));
      for (const bFile of boothFiles) {
        const fullPath = path.join(acPath, bFile);
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

        assert.ok(Array.isArray(data.electors), `${fullPath} missing electors array`);
        assert.ok(data.electors.length > 0, `${fullPath} has 0 electors`);
        assert.strictEqual(
          data.electors.length,
          data.totalElectors,
          `${fullPath} electors.length (${data.electors.length}) !== totalElectors (${data.totalElectors})`
        );

        const male = data.electors.filter((e) => e.gender === 'M').length;
        const female = data.electors.filter((e) => e.gender === 'F').length;
        const tg = data.electors.filter((e) => e.gender === 'TG').length;

        assert.strictEqual(
          male + female + tg,
          data.totalElectors,
          `${fullPath} sum of M+F+TG does not equal totalElectors`
        );

        // Check electors
        data.electors.forEach((e, idx) => {
          assert.ok(e.epic && e.epic.length >= 6, `${fullPath} elector at ${idx} has invalid EPIC: ${e.epic}`);
          assert.ok(e.name && e.name.length > 0, `${fullPath} elector at ${idx} has empty name`);
          assert.ok(e.age >= 18 && e.age <= 120, `${fullPath} elector at ${idx} has invalid age: ${e.age}`);
          assert.ok(e.pannaPage >= 1, `${fullPath} elector at ${idx} has invalid pannaPage: ${e.pannaPage}`);
        });

        checkedExtractedFiles++;
      }
    }

    assert.ok(checkedExtractedFiles > 0, 'At least 1 authentic extracted voter roll file must be verified');
  });

  // Test 8: Constituency Mandal Delimitation Coverage
  it('should verify all 175 constituencies are present in CONSTITUENCY_MANDALS with defined mandals', () => {
    for (let acNo = 1; acNo <= 175; acNo++) {
      const mandals = CONSTITUENCY_MANDALS[acNo];
      assert.ok(
        Array.isArray(mandals) && mandals.length > 0,
        `AC #${acNo} has no mandals defined in src/data/mandalData.ts`
      );

      for (const m of mandals) {
        assert.ok(m.name && m.name.length > 0, `AC #${acNo} has an unnamed mandal`);
        assert.ok(m.booths && m.booths > 0, `AC #${acNo} mandal "${m.name}" has 0 booths`);
      }

      const boothFilePath = path.join(boothsDir, `ac_${acNo}.json`);
      const fileBooths = JSON.parse(fs.readFileSync(boothFilePath, 'utf8'));
      const mandalTotalBooths = mandals.reduce((sum, m) => sum + (m.booths || 0), 0);
      assert.strictEqual(
        mandalTotalBooths,
        fileBooths.length,
        `AC #${acNo} mandal total booths (${mandalTotalBooths}) does not match booth file count (${fileBooths.length})`
      );
    }
  });

  // Test 9: Form-20 Historical PDF URLs Registry
  it('should verify all 175 constituencies have official certified Form-20 PDF URLs', () => {
    for (let acNo = 1; acNo <= 175; acNo++) {
      const url = FORM_20_URLS[acNo];
      assert.ok(url, `Missing Form-20 URL for AC #${acNo} in src/data/form20Urls.ts`);
      assert.ok(
        url.startsWith('https://ceoandhra.nic.in/'),
        `AC #${acNo} Form-20 URL does not start with https://ceoandhra.nic.in/: "${url}"`
      );
      assert.ok(
        url.endsWith('.pdf'),
        `AC #${acNo} Form-20 URL does not end with .pdf: "${url}"`
      );
    }
  });

  // Test 10: Canonical SIR 2026 URL Generator Helper
  it('should verify getOfficialSir2026PdfUrl generates accurate official ECI URLs', () => {
    const url1 = getOfficialSir2026PdfUrl(1, 1);
    assert.strictEqual(
      url1,
      'https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/1/2026-EROLLGEN-S01-1-SIR-DraftRoll-Revision1-ENG-1-WI.pdf'
    );

    const url82 = getOfficialSir2026PdfUrl(82, 100);
    assert.strictEqual(
      url82,
      'https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/82/2026-EROLLGEN-S01-82-SIR-DraftRoll-Revision1-ENG-100-WI.pdf'
    );

    const url175 = getOfficialSir2026PdfUrl(175, 290);
    assert.strictEqual(
      url175,
      'https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/175/2026-EROLLGEN-S01-175-SIR-DraftRoll-Revision1-ENG-290-WI.pdf'
    );
  });
});
