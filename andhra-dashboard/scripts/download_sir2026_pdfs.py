"""
ECI SIR 2026 Full PDF Downloader (Resumable, Per-AC Folders)
------------------------------------------------------------
Downloads official SIR 2026 Draft Roll PDFs into:
  {out_dir}/ac_{ac:03d}_{ac_slug}/booth_{booth_no:03d}.pdf

Default output directory: D:\\sir2026
Uses 12 concurrent HTTP Keep-Alive workers with atomic .tmp writes,
%PDF- header validation, and automatic skip/resume for existing PDFs.
"""

import argparse
import json
import os
import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor

import requests
import urllib3
from requests.adapters import HTTPAdapter

urllib3.disable_warnings()

BOOTHS_DIR = os.path.join('public', 'data', 'booths')
TRACKER_FILE = os.path.join('public', 'data', 'booth_extraction_tracker.json')
_TLS = threading.local()


def _get_session() -> requests.Session:
    if not hasattr(_TLS, 'session'):
        s = requests.Session()
        s.mount('https://', HTTPAdapter(pool_connections=16, pool_maxsize=16))
        s.headers.update({'User-Agent': 'Mozilla/5.0'})
        _TLS.session = s
    return _TLS.session


def slugify_ac_name(name: str) -> str:
    s = re.sub(r'[^a-z0-9]+', '_', (name or '').lower()).strip('_')
    return s or 'ac'


def is_valid_pdf(path: str) -> bool:
    if not os.path.exists(path) or os.path.getsize(path) < 10240:
        return False
    try:
        with open(path, 'rb') as f:
            return f.read(5) == b'%PDF-'
    except OSError:
        return False


def load_ac_names() -> dict[int, str]:
    names = {}
    if os.path.exists(TRACKER_FILE):
        with open(TRACKER_FILE, 'r', encoding='utf-8') as f:
            trk = json.load(f)
        for k, v in trk.get('ac_summaries', {}).items():
            if k.isdigit() and v.get('ac_name'):
                names[int(k)] = slugify_ac_name(v['ac_name'])
    return names


def download_one(args: tuple[int, int, str, str]) -> tuple[int, str, int, str | None]:
    ac_no, booth_no, url, out_path = args
    if is_valid_pdf(out_path):
        return booth_no, 'skipped', os.path.getsize(out_path), None

    tmp_path = out_path + '.tmp'
    sess = _get_session()
    last_err = None
    backoffs = (2, 5, 10, 20, 30, 45)
    for attempt, delay in enumerate(backoffs):
        try:
            with sess.get(url, stream=True, timeout=60, verify=False) as r:
                if r.status_code != 200:
                    raise RuntimeError(f'HTTP {r.status_code}')
                size = 0
                first_chunk = b''
                with open(tmp_path, 'wb') as f:
                    for chunk in r.iter_content(chunk_size=131072):
                        if not chunk:
                            continue
                        if not first_chunk:
                            first_chunk = chunk[:5]
                            if first_chunk != b'%PDF-':
                                raise RuntimeError('Invalid PDF header')
                        f.write(chunk)
                        size += len(chunk)
                if size < 10240:
                    raise RuntimeError(f'PDF too small ({size} B)')
            os.replace(tmp_path, out_path)
            return booth_no, 'downloaded', size, None
        except Exception as e:
            last_err = str(e)
            if os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except OSError:
                    pass
            if attempt < len(backoffs) - 1:
                time.sleep(delay)

    return booth_no, 'error', 0, last_err


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--start', type=int, default=1)
    parser.add_argument('--end', type=int, default=175)
    parser.add_argument('--workers', type=int, default=12)
    parser.add_argument('--out-dir', type=str, default=r'D:\sir2026')
    args = parser.parse_args()

    ac_names = load_ac_names()
    os.makedirs(args.out_dir, exist_ok=True)
    progress_file = os.path.join(args.out_dir, 'download_progress.json')
    progress = {'updated_at': None, 'acs': {}}
    if os.path.exists(progress_file):
        try:
            with open(progress_file, 'r', encoding='utf-8') as f:
                progress = json.load(f)
        except Exception:
            pass
    t_all = time.time()

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        for ac_no in range(args.start, args.end + 1):
            bf = os.path.join(BOOTHS_DIR, f'ac_{ac_no}.json')
            if not os.path.exists(bf):
                continue
            with open(bf, 'r', encoding='utf-8') as f:
                booths = json.load(f)

            slug = ac_names.get(ac_no, f'ac_{ac_no}')
            ac_dir = os.path.join(args.out_dir, f'ac_{ac_no:03d}_{slug}')
            os.makedirs(ac_dir, exist_ok=True)

            # Remove any orphan .tmp left by sudden power loss
            for fn in os.listdir(ac_dir):
                if fn.endswith('.tmp'):
                    try:
                        os.remove(os.path.join(ac_dir, fn))
                    except OSError:
                        pass

            tasks = []
            task_map = {}
            for b in booths:
                bno = b['booth_no']
                url = (
                    (b.get('roll_2026') or {}).get('url')
                    or b.get('roll_2026_url')
                    or f'https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/{ac_no}/2026-EROLLGEN-S01-{ac_no}-SIR-DraftRoll-Revision1-ENG-{bno}-WI.pdf'
                )
                out_path = os.path.join(ac_dir, f'booth_{bno:03d}.pdf')
                item = (ac_no, bno, url, out_path)
                tasks.append(item)
                task_map[bno] = item

            t0 = time.time()
            dl_cnt = skip_cnt = 0
            dl_bytes = tot_bytes = 0
            err_items = []
            for bno, status, sz, err in ex.map(download_one, tasks):
                tot_bytes += sz
                if status == 'downloaded':
                    dl_cnt += 1
                    dl_bytes += sz
                elif status == 'skipped':
                    skip_cnt += 1
                else:
                    err_items.append((bno, err))

            # Automatic second pass for any transient network drops
            if err_items:
                time.sleep(15)
                still_err = []
                for bno, status, sz, err in ex.map(download_one, [task_map[b] for b, _ in err_items]):
                    tot_bytes += sz
                    if status == 'downloaded':
                        dl_cnt += 1
                        dl_bytes += sz
                    elif status == 'skipped':
                        skip_cnt += 1
                    else:
                        still_err.append((bno, err))
                        print(f'  [AC {ac_no:3d} B{bno:3d}] ERR: {err}', flush=True)
                err_items = still_err

            dt = max(0.01, time.time() - t0)
            mb_s = (dl_bytes / (1024 * 1024)) / dt
            print(
                f'[AC {ac_no:3d} {slug}] ok={dl_cnt + skip_cnt}/{len(tasks)} '
                f'(new={dl_cnt}, skip={skip_cnt}, err={len(err_items)}) | '
                f'{tot_bytes / (1024**3):.2f} GB total ({dl_bytes / (1024**2):.1f} MB new) '
                f'in {dt:.1f}s ({mb_s:.2f} MB/s)',
                flush=True,
            )

            progress.setdefault('acs', {})[str(ac_no)] = {
                'ac_no': ac_no,
                'slug': slug,
                'ok': dl_cnt + skip_cnt,
                'total': len(tasks),
                'errors': [b for b, _ in err_items],
                'bytes': tot_bytes,
                'gb': round(tot_bytes / (1024**3), 3),
                'updated_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            }
            progress['updated_at'] = time.strftime('%Y-%m-%d %H:%M:%S')
            progress['last_ac'] = ac_no
            tmp_prog = progress_file + '.tmp'
            with open(tmp_prog, 'w', encoding='utf-8') as f:
                json.dump(progress, f, indent=2)
            os.replace(tmp_prog, progress_file)

    print(f'Finished ACs {args.start}..{args.end} in {time.time() - t_all:.1f}s', flush=True)


if __name__ == '__main__':
    main()
