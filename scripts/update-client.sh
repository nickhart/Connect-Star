#!/bin/bash

# Update Simple Game Server Client
# This script rebuilds the TypeScript client and updates the Connect-Star dependency

set -e  # Exit on any error

echo "🔄 Updating Simple Game Server Client..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

CLIENT_DIR="../simple-game-server/clients/typescript"
CONNECT_STAR_DIR="."

# Check if client directory exists
if [ ! -d "$CLIENT_DIR" ]; then
    echo -e "${RED}❌ Client directory not found: $CLIENT_DIR${NC}"
    echo "   Make sure simple-game-server is cloned at ../simple-game-server"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Building TypeScript client...${NC}"
cd "$CLIENT_DIR"
npm run build

echo -e "${BLUE}📦 Step 2: Creating new package tarball...${NC}"
npm pack

echo -e "${BLUE}📦 Step 3: Updating Connect-Star dependencies...${NC}"
cd "$CONNECT_STAR_DIR"
pnpm install --force

echo -e "${GREEN}✅ Client update complete!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "   1. Restart your development server"
echo "   2. Test the updated client functionality"
echo ""
echo -e "${BLUE}💡 To restart dev server:${NC}"
echo "   pnpm web"