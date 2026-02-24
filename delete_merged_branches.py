#!/usr/bin/env python3
import argparse
import subprocess
import sys

def run_command(command, check=True):
    try:
        # shell=True is needed for some commands but risky. Here we use it carefully.
        result = subprocess.run(command, shell=True, check=check, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        if check:
            print(f"Error running command '{command}': {e.stderr}")
        return None

def get_remote_branches():
    output = run_command("git branch -r")
    if not output:
        return []
    branches = []
    for line in output.split('\n'):
        line = line.strip()
        if "->" in line: # Skip HEAD pointer
            continue
        if "origin/main" in line: # Skip main itself
            continue
        branches.append(line)
    return branches

def is_merged(branch):
    # Check regular merge
    try:
        subprocess.run(f"git merge-base --is-ancestor {branch} origin/main", shell=True, check=True, stderr=subprocess.DEVNULL)
        return True
    except subprocess.CalledProcessError:
        pass

    # Check squash merge / cherry-pick via patch ID
    merge_base = run_command(f"git merge-base origin/main {branch}", check=False)
    if not merge_base:
        return False

    output = run_command(f"git cherry origin/main {branch}", check=False)
    if output is None:
        return False

    if not output:
        return True

    for line in output.split('\n'):
        if line.startswith("+"):
            return False

    return True

def delete_branch(branch, remote_delete=False):
    if branch.startswith("origin/"):
        remote_branch_name = branch[7:] # Remove 'origin/' prefix
    else:
        print(f"Skipping malformed branch name: {branch}")
        return

    if remote_delete:
        print(f"Deleting remote branch {remote_branch_name}...")
        res = run_command(f"git push origin --delete {remote_branch_name}", check=False)
        if res is not None:
            print(f"Successfully deleted {remote_branch_name} from remote.")
        else:
            print(f"Failed to delete {remote_branch_name} from remote.")
    else:
        print(f"Deleting local tracking branch {branch}...")
        res = run_command(f"git branch -dr {branch}", check=False)
        if res is not None:
            print(f"Successfully deleted {branch} locally.")
        else:
            print(f"Failed to delete {branch} locally.")

def main():
    parser = argparse.ArgumentParser(description="Delete merged remote branches.")
    parser.add_argument("--remote", action="store_true", help="Delete branches from the remote repository (requires push permissions). Default is local cleanup only.")
    args = parser.parse_args()

    print("Fetching latest changes...")
    run_command("git fetch --all --prune")

    # Ensure history is deep enough for checks
    is_shallow = run_command("git rev-parse --is-shallow-repository")
    if is_shallow == "true":
        print("Repository is shallow. Unshallowing to ensure correct merge detection...")
        run_command("git fetch --unshallow", check=False)

    branches = get_remote_branches()
    print(f"Checking {len(branches)} remote branches...")
    merged_branches = []

    current_branch_name = run_command("git branch --show-current")
    current_remote_ref = f"origin/{current_branch_name}" if current_branch_name else None

    for branch in branches:
        if current_remote_ref and branch == current_remote_ref:
            print(f"Skipping current branch: {branch}")
            continue

        if is_merged(branch):
            print(f"Identified as merged: {branch}")
            merged_branches.append(branch)

    print(f"\nFound {len(merged_branches)} merged branches.")

    if not merged_branches:
        print("No branches to delete.")
        return

    # confirm = input(f"Are you sure you want to delete {len(merged_branches)} branches? (y/N) ")
    # if confirm.lower() != 'y':
    #     print("Aborted.")
    #     return

    # Proceed with deletion
    for branch in merged_branches:
        delete_branch(branch, remote_delete=args.remote)

    print("Cleanup complete.")

if __name__ == "__main__":
    main()
