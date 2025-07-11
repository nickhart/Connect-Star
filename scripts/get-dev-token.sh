#!/bin/bash

# Development Token Generator
# Generates a JWT token for testing API endpoints

set -e

echo "🔑 Getting development token..."

# Default credentials for development
EMAIL=${1:-"player1@example.com"}
PASSWORD=${2:-"password123"}
API_URL=${3:-"http://localhost:3000"}

echo "📧 Using email: $EMAIL"
echo "🌐 API URL: $API_URL"

# Login and extract token
RESPONSE=$(curl -s -X POST "$API_URL/api/tokens/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"session\": {\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}}")

# Extract token using jq if available, otherwise use basic parsing
if command -v jq &> /dev/null; then
  TOKEN=$(echo "$RESPONSE" | jq -r '.data.access_token')
else
  # Fallback parsing without jq
  TOKEN=$(echo "$RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
fi

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token"
  echo "Response: $RESPONSE"
  exit 1
fi

echo "✅ Token obtained!"
echo "🔑 $TOKEN"
echo ""
echo "💡 Usage examples:"
echo "curl -H \"Authorization: Bearer $TOKEN\" $API_URL/api/games"
echo "curl -H \"Authorization: Bearer $TOKEN\" $API_URL/api/players/me"