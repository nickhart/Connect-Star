#!/bin/bash

# Pre-flight check script for Connect-Star
# Run this before committing/pushing to catch issues early

set -e

echo "🚀 Connect-Star Pre-flight Check"
echo "==============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "INFO")
            echo -e "${YELLOW}ℹ️  $message${NC}"
            ;;
    esac
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -f "turbo.json" ]]; then
    print_status "ERROR" "Please run this script from the project root directory"
    exit 1
fi

# 1. Format check
echo "1. Checking code formatting..."
if pnpm format:check > /dev/null 2>&1; then
    print_status "SUCCESS" "Code formatting is correct"
else
    print_status "WARNING" "Code formatting issues found. Run 'pnpm format' to fix them."
    echo "   Would you like to auto-fix formatting now? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        pnpm format
        print_status "SUCCESS" "Code formatting fixed"
    else
        print_status "INFO" "Skipping formatting fixes"
    fi
fi

echo ""

# 2. Linting
echo "2. Running linter..."
if pnpm lint > /dev/null 2>&1; then
    print_status "SUCCESS" "Linting passed"
else
    print_status "ERROR" "Linting failed. Please fix the issues:"
    pnpm lint
    exit 1
fi

echo ""

# 3. Type checking
echo "3. Running type checker..."
if pnpm type-check > /dev/null 2>&1; then
    print_status "SUCCESS" "Type checking passed"
else
    print_status "ERROR" "Type checking failed. Please fix the issues:"
    pnpm type-check
    exit 1
fi

echo ""

# 4. Tests
echo "4. Running tests..."
if pnpm test > /dev/null 2>&1; then
    print_status "SUCCESS" "All tests passed"
else
    print_status "ERROR" "Tests failed. Please fix the issues:"
    pnpm test
    exit 1
fi

echo ""

# 5. Build
echo "5. Testing build..."
if pnpm build > /dev/null 2>&1; then
    print_status "SUCCESS" "Build completed successfully"
else
    print_status "ERROR" "Build failed. Please fix the issues:"
    pnpm build
    exit 1
fi

echo ""
echo "🎉 All pre-flight checks passed!"
echo "✈️  Ready for takeoff (commit/push)!"
echo ""

# Optional: Show current branch and status
echo "📋 Current status:"
echo "   Branch: $(git branch --show-current)"
echo "   Status: $(git status --porcelain | wc -l | tr -d ' ') file(s) modified"
echo ""

# Optional: Offer to create a commit
if [[ -n "$(git status --porcelain)" ]]; then
    echo "Would you like to commit your changes now? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Enter commit message:"
        read -r commit_message
        git add .
        git commit -m "$commit_message"
        print_status "SUCCESS" "Changes committed successfully"
    fi
fi