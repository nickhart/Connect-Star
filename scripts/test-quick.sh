#!/bin/bash

# Quick test runner for Connect-Star
# Runs tests with coverage and shows results

echo "🧪 Running Connect-Star Tests"
echo "============================"
echo ""

# Run tests with coverage
pnpm test:coverage

echo ""
echo "📊 Test Summary:"
echo "   - Check coverage/lcov-report/index.html for detailed coverage report"
echo "   - Minimum coverage requirement: 75%"
echo ""