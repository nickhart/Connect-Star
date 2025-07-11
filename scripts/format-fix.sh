#!/bin/bash

# Format and lint fixer for Connect-Star
# Automatically fixes formatting and linting issues

echo "🎨 Fixing Connect-Star Code Style"
echo "================================="
echo ""

# Format code
echo "1. Formatting code..."
pnpm format
echo "   ✅ Code formatted"

echo ""

# Run linter with auto-fix
echo "2. Running linter with auto-fix..."
pnpm quality:fix
echo "   ✅ Linting issues fixed (where possible)"

echo ""
echo "🎉 Code style fixes completed!"
echo "💡 Remember to review the changes before committing"
echo ""