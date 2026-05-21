import subprocess
import os
import sys

NAMESPACE = os.getenv("KUBE_NAMESPACE")
REGISTRY = os.getenv("REGISTRY_IMAGE")
TAG = os.getenv("CI_COMMIT_SHORT_SHA")
COMPONENT = sys.argv[1]

def run_script(cmd, check=True):
    print(f"$ {' '.join(cmd)}", flush=True)
    result = subprocess.run(cmd, text=True)
    if check and result.returncode != 0:
        sys.exit(result.returncode)
    return result

def apply_manifests(component):
    run_script(["kubectl", "apply", "-f", f"K3s/base/", "-n", NAMESPACE])
    run_script(["kubectl", "apply", "-f", f"K3s/{component}/", "-n", NAMESPACE])
    run_script(["kubectl", "apply", "-f", "K3s/ingress/", "-n", NAMESPACE])

def create_image(component):
    image = f"{REGISTRY}/volunti-{component}:{TAG}"
    run_script(["kubectl", "set", "image",
                f"deployment/volunti-{component}",
                f"volunti-{component}={image}",
                "-n", NAMESPACE])

def rollout_status(component):
    run_script(["kubectl", "rollout", "status",
                f"deployment/volunti-{component}",
                "-n", NAMESPACE, "--timeout=120s"])

def main():
    if not REGISTRY or not TAG:
        print("Please set a REGISTRY_IMAGE and a CI_COMMIT_SHORT_SHA", file=sys.stderr)
        sys.exit(1)
    print(f"Deploying {COMPONENT}:{NAMESPACE}:{TAG}")
    apply_manifests(COMPONENT)
    create_image(COMPONENT)
    rollout_status(COMPONENT)
    print(f"Succesfully deployed {COMPONENT}")

if __name__ == "__main__":
    main()
