"""
Automated Kaggle GPU Pipeline for AC 2 (Palasa)
-----------------------------------------------
1. Waits for dataset nid2570/ac2-sir2026-pdfs to finish uploading.
2. Pushes GPU kernel nid2570/sir2026-ac2-gpu-extractor.
3. Streams live GPU extraction progress and ETA.
4. Auto-downloads and unpacks ac_2_voters.zip into public/data/voters/ac_2/.
5. Updates public/data/booths/ac_2.json marking isAuthenticExtract: true.
"""

import json
import os
import subprocess
import sys
import time
import zipfile

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
RUNNER_DIR = os.path.join(WORKSPACE_ROOT, 'kaggle_ac2_runner')
AC2_VOTERS_DIR = os.path.join(WORKSPACE_ROOT, 'public', 'data', 'voters', 'ac_2')
AC2_BOOTH_META = os.path.join(WORKSPACE_ROOT, 'public', 'data', 'booths', 'ac_2.json')


def run_cmd(cmd_list):
    res = subprocess.run(cmd_list, capture_output=True, text=True, check=False)
    return res.returncode, res.stdout.strip(), res.stderr.strip()


def check_dataset_ready():
    print("[Pipeline] Checking status of dataset nid2570/ac2-sir2026-pdfs...", flush=True)
    code, out, _ = run_cmd([sys.executable, '-m', 'kaggle', 'datasets', 'status', 'nid2570/ac2-sir2026-pdfs'])
    if code == 0:
        print(f"[Dataset] Current status: {out}", flush=True)
        return 'ready' in out.lower()
    return False


def wait_for_dataset():
    print("[Pipeline] Waiting for dataset upload to finalize on Kaggle...", flush=True)
    for _ in range(120):
        if check_dataset_ready():
            print("[Dataset] Dataset is READY on Kaggle!", flush=True)
            return True
        time.sleep(10)
    return False


def push_gpu_kernel():
    print("\n[Pipeline] Pushing GPU kernel to Kaggle...", flush=True)
    code, out, err = run_cmd([sys.executable, '-m', 'kaggle', 'kernels', 'push', '-p', RUNNER_DIR])
    print(out if out else err, flush=True)
    return code == 0


def monitor_kernel():
    print("\n[Pipeline] Monitoring Kaggle GPU extraction job...", flush=True)
    kernel_slug = 'nid2570/sir2026-ac2-gpu-extractor'
    prev_status = ''
    while True:
        code, out, err = run_cmd([sys.executable, '-m', 'kaggle', 'kernels', 'status', kernel_slug])
        if out != prev_status:
            print(f"[Kaggle Status] {out}", flush=True)
            prev_status = out

        if 'complete' in out.lower():
            print("[Pipeline] Kernel run COMPLETED successfully!", flush=True)
            return True
        if 'error' in out.lower() or 'failed' in out.lower():
            print(f"[Pipeline] Kernel encountered an error: {out}", flush=True)
            return False

        time.sleep(15)


def download_and_ingest():
    kernel_slug = 'nid2570/sir2026-ac2-gpu-extractor'
    temp_out = os.path.join(WORKSPACE_ROOT, 'temp_ac2_out')
    os.makedirs(temp_out, exist_ok=True)
    os.makedirs(AC2_VOTERS_DIR, exist_ok=True)

    print(f"\n[Pipeline] Downloading output from {kernel_slug}...", flush=True)
    code, out, err = run_cmd([sys.executable, '-m', 'kaggle', 'kernels', 'output', kernel_slug, '-p', temp_out])
    print(out if out else err, flush=True)

    zip_file = os.path.join(temp_out, 'ac_2_voters.zip')
    if os.path.exists(zip_file):
        print(f"[Pipeline] Extracting {zip_file} into {AC2_VOTERS_DIR}...", flush=True)
        with zipfile.ZipFile(zip_file, 'r') as zf:
            for member in zf.namelist():
                # Strip leading 'ac_2/' if present
                fname = os.path.basename(member)
                if fname.endswith('.json'):
                    target_path = os.path.join(AC2_VOTERS_DIR, fname)
                    with open(target_path, 'wb') as f:
                        f.write(zf.read(member))
        print(f"[Pipeline] Extracted voter roll JSONs to {AC2_VOTERS_DIR}", flush=True)

    # Update ac_2.json booth metadata
    if os.path.exists(AC2_BOOTH_META):
        try:
            with open(AC2_BOOTH_META, 'r', encoding='utf-8') as f:
                booths_data = json.load(f)
            booths = booths_data.get('booths', booths_data if isinstance(booths_data, list) else [])
            for b in booths:
                b['isAuthenticExtract'] = True
            with open(AC2_BOOTH_META, 'w', encoding='utf-8') as f:
                json.dump(booths_data, f, indent=2, ensure_ascii=False)
            print(f"[Pipeline] Updated {AC2_BOOTH_META} with isAuthenticExtract=True", flush=True)
        except Exception as e:
            print(f"[Pipeline] Note: Could not update booth meta: {e}", flush=True)


if __name__ == '__main__':
    code, out, _ = run_cmd([sys.executable, '-m', 'kaggle', 'kernels', 'status', 'nid2570/sir2026-ac2-gpu-extractor'])
    if 'queued' not in out.lower() and 'running' not in out.lower() and 'complete' not in out.lower():
        if wait_for_dataset():
            push_gpu_kernel()

    if monitor_kernel():
        download_and_ingest()
        print("\n[SUCCESS] 