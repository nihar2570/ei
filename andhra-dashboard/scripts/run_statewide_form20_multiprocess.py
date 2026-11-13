"""
High-Precision 4-Worker Form-20 Statewide Master Orchestrator
Spawns 4 concurrent workers, streams real-time logs, and validates final booth integrity.
"""

import os
import sys
import time
import subprocess
import threading
import glob
import json

NUM_WORKERS = 4

def stream_worker(proc, wid):
    for line in iter(proc.stdout.readline, ''):
        if not line:
            break
        print(line, end='', flush=True)

def main():
    print(f"===================================================================", flush=True)
    print(f"🚀 Launching Statewide Form-20 Precision Extraction with {NUM_WORKERS} Workers", flush=True)
    print(f"===================================================================", flush=True)
    
    t0 = time.time()
    workers = []
    
    for wid in range(NUM_WORKERS):
        cmd = [
            sys.executable,
            'scripts/extract_form20_worker.py',
            '--worker-id', str(wid),
            '--num-workers', str(NUM_WORKERS)
        ]
        p = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        workers.append(p)
        t = threading.Thread(target=stream_worker, args=(p, wid), daemon=True)
        t.start()
        
    # Wait for all workers to finish
    for p in workers:
        p.wait()
        
    elapsed = time.time() - t0
    print(f"\n===================================================================", flush=True)
    print(f"✅ All {NUM_WORKERS} workers completed in {elapsed:.1f}s ({elapsed/60:.1f} mins)!", flush=True)
    print(f"===================================================================", flush=True)
    
    # Audit final stats
    total_booths = 0
    total_verified = 0
    total_inherited = 0
    total_model = 0
    
    for f in sorted(glob.glob('public/data/booths/ac_*.json')):
        booths = json.load(open(f, encoding='utf-8'))
        for b in booths:
            total_booths += 1
            src = b.get('form20_source', '')
            if 'OFFICIAL' in src:
                total_verified += 1
            elif 'CAMPUS' in src:
                total_inherited += 1
            else:
                total_model += 1
                
    print(f"\n📊 FINAL STATEWIDE FORM-20 VERIFICATION AUDIT:")
    print(f"  Total Booths: {total_booths:,}")
    print(f"  Directly Certified (Official Form-20): {total_verified:,} ({total_verified/total_booths*100:.1f}%)")
    print(f"  Campus Inherited (2026 Aux Booths):    {total_inherited:,} ({total_inherited/total_booths*100:.1f}%)")
    print(f"  Calibrated Model Estimates:            {total_model:,} ({total_model/total_booths*100:.1f}%)")
    print(f"===================================================================\n", flush=True)

if __name__ == '__main__':
    main()
