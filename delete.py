import os
import sys
import subprocess

NAMESPACE = os.getenv("KUBE_NAMESPACE", "doe25-group-13")

def run_script(cmd, check=True):
    print(f"$ {' '.join(cmd)}", flush=True)
    result = subprocess.run(cmd, text=True)
    if check and result.returncode != 0:
        sys.exit(result.returncode)
    return result

def delete_environment():
    print(f"Deleting environment: {NAMESPACE}")
    run_script(["kubectl", "delete", "deployment", "backend", "frontend",
                "-n", NAMESPACE, "--ignore-not-found"])
    print("Completed")

if __name__ == "__main__":
    delete_environment()
