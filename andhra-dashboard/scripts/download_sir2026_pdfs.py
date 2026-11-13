"""
ECI SIR 2026 Full PDF Downloader (Resumable, Per-AC Folders)
------------------------------------------------------------
Downloads official SIR 2026 Draft Roll PDFs into:
  {out_dir}/ac_{ac:03d}_{ac_slug}/booth_{booth_no:03d}.pdf

Default output directory: D:\\sir2026
Uses concurrent HTTP Keep-Alive workers with atomic .tmp writes,
%PDF- header validation, real-time per-booth logging, and instant
directory-set cache skipping.
"""

import argparse
import json
import os
import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

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
        s.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://voters.eci.gov.in/',
        })
        _TLS.session = s
    return _TLS.session


def slugify_ac_name(name: str) -> str:
    s = re.sub(r'[^a-z0-9]+', '_', (name or '').lower()).strip('_')
    return s or 'ac'


def load_ac_names() -> dict[int, str]:
    names = {}
    if os.path.exists(TRACKER_FILE):
        with open(TRACKER_FILE, 'r', encoding='utf-8') as f:
            trk = json.load(f)
        for k, v in trk.get('ac_summaries', {}).items():
            if k.isdigit() and v.get('ac_name'):
                names[int(k)] = slugify_ac_name(v['ac_name'])
    return names


def download_one(args: tuple[int, int, str, str]) -> tuple[int, str, int, float, str | None]:
    ac_no, booth_no, url, out_path = args
    if os.path.exists(out_path) and os.path.getsize(out_path) >= 10240:
        return booth_no, 'skipped', os.path.getsize(out_path), 0.0, None

    tmp_path = out_path + '.tmp'
    sess = _get_session()
    last_err = None
    backoffs = (2, 5, 10, 20, 30, 45)
    t_start = time.time()
    for attempt, delay in enumerate(backoffs):
        try:
            with sess.get(url, stream=True, timeout=60, verify=False) as r:
                if r.status_code == 404:
                    return booth_no, 'error', 0, time.time() - t_start, 'HTTP 404 Not Found'
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
            return booth_no, 'downloaded', size, time.time() - t_start, None
        except Exception as e:
            last_err = str(e)
            if os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except OSError:
                    pass
            if attempt < len(backoffs) - 1:
                time.sleep(delay)

    return booth_no, 'error', 0, time.time() - t_start, last_err


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--start', type=int, default=1)
    parser.add_argument('--end', type=int, default=175)
    parser.add_argument('--acs', type=str, default=None, help='Comma-separated AC numbers, e.g. 75,76,83')
    parser.add_argument('--missing-only', action='store_true', default=False, help='Only download ACs with missing booths')
    parser.add_argument('--workers', type=int, default=6)
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

    # Determine which ACs to process
    if args.acs:
        target_acs = [int(x.strip()) for x in args.acs.split(',') if x.strip().isdigit()]
    elif args.missing_only:
        target_acs = []
        for ac_no in range(args.start, args.end + 1):
            bf = os.path.join(BOOTHS_DIR, f'ac_{ac_no}.json')
            if not os.path.exists(bf):
                continue
            with open(bf, 'r', encoding='utf-8') as f:
                booths = json.load(f)
            slug = ac_names.get(ac_no, f'ac_{ac_no}')
            ac_dir = os.path.join(args.out_dir, f'ac_{ac_no:03d}_{slug}')
            disk_count = 0
            if os.path.exists(ac_dir):
                disk_count = len([f for f in os.listdir(ac_dir) if f.endswith('.pdf')])
            if disk_count < len(booths):
                target_acs.append(ac_no)
    else:
        target_acs = list(range(args.start, args.end + 1))

    print(f'=== SIR 2026 Downloader starting for {len(target_acs)} ACs with {args.workers} workers ===', flush=True)
    t_all = time.time()
    total_new_statewide = 0
    total_bytes_statewide = 0

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        for idx, ac_no in enumerate(target_acs, 1):
            bf = os.path.join(BOOTHS_DIR, f'ac_{ac_no}.json')
            if not os.path.exists(bf):
                continue
            with open(bf, 'r', encoding='utf-8') as f:
                booths = json.load(f)

            slug = ac_names.get(ac_no, f'ac_{ac_no}')
            ac_dir = os.path.join(args.out_dir, f'ac_{ac_no:03d}_{slug}')
            os.makedirs(ac_dir, exist_ok=True)

            # Fast directory inventory in memory (avoids slow per-file I/O)
            existing_map = {}
            for fn in os.listdir(ac_dir):
                if fn.endswith('.tmp'):
                    try:
                        os.remove(os.path.join(ac_dir, fn))
                    except OSError:
                        pass
                elif fn.endswith('.pdf'):
                    try:
                        sz = os.path.getsize(os.path.join(ac_dir, fn))
                        if sz >= 10240:
                            existing_map[fn] = sz
                    except OSError:
                        pass

            skip_cnt = 0
            tot_bytes = 0
            tasks = []
            task_map = {}
            for b in booths:
                bno = b['booth_no']
                fn = f'booth_{bno:03d}.pdf'
                if fn in existing_map:
                    skip_cnt += 1
                    tot_bytes += existing_map[fn]
                else:
                    url = (
                        (b.get('roll_2026') or {}).get('url')
                        or b.get('roll_2026_url')
                        or f'https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/{ac_no}/2026-EROLLGEN-S01-{ac_no}-SIR-DraftRoll-Revision1-ENG-{bno}-WI.pdf'
                    )
                    out_path = os.path.join(ac_dir, fn)
                    item = (ac_no, bno, url, out_path)
                    tasks.append(item)
                    task_map[bno] = item

            # If all booths already exist, skip instantly
            if not tasks:
                print(
                    f'[{idx}/{len(target_acs)}] [AC {ac_no:3d} {slug}] Already complete: {skip_cnt}/{len(booths)} booths '
                    f'({tot_bytes / (1024**3):.2f} GB) - skipped',
                    flush=True,
                )
                continue

            print(
                f'\n>>> [{idx}/{len(target_acs)}] [AC {ac_no:3d} {slug}] Downloading {len(tasks)} missing booths '
                f'(already have {skip_cnt}/{len(booths)})...',
                flush=True,
            )

            t0 = time.time()
            dl_cnt = 0
            dl_bytes = 0
            err_items = []

            # Stream downloads and report each booth immediately as it finishes
            futures = {ex.submit(download_one, item): item for item in tasks}
            for fut in as_completed(futures):
                bno, status, sz, elapsed_sec, err = fut.result()
                if status == 'downloaded':
                    dl_cnt += 1
                    dl_bytes += sz
                    tot_bytes += sz
                    total_new_statewide += 1
                    total_bytes_statewide += sz
                    mb_s = (sz / (1024 * 1024)) / max(0.01, elapsed_sec)
                    pct = (dl_cnt / len(tasks)) * 100
                    print(
                        f'  [AC {ac_no:3d} B{bno:03d}] OK: {sz / (1024*1024):.2f} MB in {elapsed_sec:.1f}s ({mb_s:.2f} MB/s) | '
                        f'Booth {dl_cnt}/{len(tasks)} ({pct:.0f}%)',
                        flush=True,
                    )
                elif status == 'skipped':
                    skip_cnt += 1
                    tot_bytes += sz
                else:
                    err_items.append((bno, err))
                    print(f'  [AC {ac_no:3d} B{bno:03d}] ERR: {err}', flush=True)

            # Automatic second pass for any transient network drops (ignoring 404 Not Found)
            retry_candidates = [(b, err) for b, err in err_items if '404' not in str(err)]
            if retry_candidates:
                print(f'  [AC {ac_no:3d}] Retrying {len(retry_candidates)} failed booths after 10s cool-down...', flush=True)
                time.sleep(10)
                still_err = [b for b, err in err_items if '404' in str(err)]
                retry_futures = {ex.submit(download_one, task_map[b]): b for b, _ in retry_candidates}
                for fut in as_completed(retry_futures):
                    bno, status, sz, elapsed_sec, err = fut.result()
                    if status == 'downloaded':
                        dl_cnt += 1
                        dl_bytes += sz
                        tot_bytes += sz
                        total_new_statewide += 1
                        total_bytes_statewide += sz
                        mb_s = (sz / (1024 * 1024)) / max(0.01, elapsed_sec)
                        print(f'  [AC {ac_no:3d} B{bno:03d}] (Retry) OK: {sz / (1024*1024):.2f} MB in {elapsed_sec:.1f}s ({mb_s:.2f} MB/s)', flush=True)
                    else:
                        still_err.append(bno)
                        print(f'  [AC {ac_no:3d} B{bno:03d}] (Retry Failed) ERR: {err}', flush=True)
                err_items = [(b, 'error') for b in still_err]

            dt = max(0.01, time.time() - t0)
            mb_s = (dl_bytes / (1024 * 1024)) / dt
            print(
                f'[AC {ac_no:3d} {slug}] FINISHED: {dl_cnt + skip_cnt}/{len(booths)} total '
                f'(new={dl_cnt}, skip={skip_cnt}, err={len(err_items)}) | '
                f'{tot_bytes / (1024**3):.2f} GB total ({dl_bytes / (1024**2):.1f} MB new) '
                f'in {dt:.1f}s ({mb_s:.2f} MB/s)',
                flush=True,
            )

            progress.setdefault('acs', {})[str(ac_no)] = {
                'ac_no': ac_no,
                'slug': slug,
                'ok': dl_cnt + skip_cnt,
                'total': len(booths),
                'errors': [b for b, _ in err_items],
                'bytes': tot_bytes,
                'gb': round(tot_bytes / (1024**3), 3),
                'updated_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            }
            progress['updated_at'] = time.strftime('%Y-%m-%d %H:%M:%S')
            progress['last_ac'] = ac_no

            # Merge any entries added on disk by other runs before writing
            if os.path.exists(progress_file):
                try:
                    with open(progress_file, 'r', encoding='utf-8') as f:
                        disk_prog = json.load(f)
                    for k, v in disk_prog.get('acs', {}).items():
                        if k != str(ac_no):
                            progress.setdefault('acs', {})[k] = v
                except Exception:
                    pass

            tmp_prog = progress_file + '.tmp'
            with open(tmp_prog, 'w', encoding='utf-8') as f:
                json.dump(progress, f, indent=2)
            os.replace(tmp_prog, progress_file)

    dt_all = time.time() - t_all
    print(
        f'\n=== All done! Downloaded {total_new_statewide} new booths ({total_bytes_statewide / (1024**3):.2f} GB) '
        f'in {dt_all:.1f}s ({dt_all / 60:.1f} min) ===',
        flush=True,
    )


if __name__ == '__main__':
    main()
