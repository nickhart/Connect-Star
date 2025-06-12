#!/bin/bash

# =============================================================================
# Auto-watch GitHub Actions CI Script
# =============================================================================
# This script automatically monitors the latest CI run after a push
# Usage: ./scripts/watch-ci.sh [branch-name]
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BRANCH=${1:-$(git branch --show-current)}
MAX_WAIT=60  # Maximum seconds to wait for new run

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed. Please install it first."
    exit 1
fi

# Get the latest commit hash
LATEST_COMMIT=$(git rev-parse HEAD)
SHORT_COMMIT=$(git rev-parse --short HEAD)

print_info "Monitoring CI for branch: $BRANCH"
print_info "Latest commit: $SHORT_COMMIT"
print_info "Waiting for GitHub Actions to start..."

# Function to get the latest run for this branch
get_latest_run() {
    gh run list --branch="$BRANCH" --limit=1 --json=databaseId,headSha,conclusion,status --jq='.[0] // empty'
}

# Wait for a new run to appear
ELAPSED=0
while [ $ELAPSED -lt $MAX_WAIT ]; do
    LATEST_RUN=$(get_latest_run)
    
    if [ -n "$LATEST_RUN" ]; then
        RUN_COMMIT=$(echo "$LATEST_RUN" | jq -r '.headSha // empty')
        RUN_ID=$(echo "$LATEST_RUN" | jq -r '.databaseId // empty')
        RUN_STATUS=$(echo "$LATEST_RUN" | jq -r '.status // empty')
        
        # Check if this run is for our latest commit
        if [ "$RUN_COMMIT" = "$LATEST_COMMIT" ]; then
            print_success "Found CI run for commit $SHORT_COMMIT (ID: $RUN_ID)"
            
            if [ "$RUN_STATUS" = "in_progress" ] || [ "$RUN_STATUS" = "queued" ]; then
                print_info "Starting to watch CI run..."
                echo ""
                gh run watch "$RUN_ID"
                exit 0
            elif [ "$RUN_STATUS" = "completed" ]; then
                print_info "Run already completed. Showing results..."
                echo ""
                gh run view "$RUN_ID"
                exit 0
            fi
        fi
    fi
    
    sleep 2
    ELAPSED=$((ELAPSED + 2))
    echo -n "."
done

echo ""
print_warning "No new CI run detected within $MAX_WAIT seconds."
print_info "You can manually check with: gh run list --branch=$BRANCH"
exit 1