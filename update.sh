#!/bin/bash
set -e

# Branch names
UPSTREAM_BRANCH="master"
CUSTOM_BRANCH="logo-changes"
UPSTREAM_REMOTE="upstream"

# Ensure we are in a git repo
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "❌ Not a git repository. Run this inside your kepler.gl repo."
  exit 1
fi

# Detect current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" != "$CUSTOM_BRANCH" ]; then
  echo "❌ You must run this script from the '$CUSTOM_BRANCH' branch (currently on '$CURRENT_BRANCH')."
  exit 1
fi

echo "🚀 Updating $CUSTOM_BRANCH against $UPSTREAM_REMOTE/$UPSTREAM_BRANCH..."

# 1. Fetch upstream
git fetch $UPSTREAM_REMOTE

# 2. Update master (fast-forward only)
git checkout $UPSTREAM_BRANCH
git merge --ff-only $UPSTREAM_REMOTE/$UPSTREAM_BRANCH
git push origin $UPSTREAM_BRANCH

# 3. Rebase logo-changes on updated master
git checkout $CUSTOM_BRANCH
git rebase $UPSTREAM_BRANCH

# 4. Push updated logo-changes
git push origin $CUSTOM_BRANCH --force

echo "✅ $CUSTOM_BRANCH is now up-to-date with $UPSTREAM_REMOTE/$UPSTREAM_BRANCH + your custom changes."
