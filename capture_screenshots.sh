#!/bin/bash
# Capture website screenshots using Firecrawl API via curl

FIRECRAWL_API_KEY="${FIRECRAWL_API_KEY:-}"

# VIVO United screenshot
echo "Capturing VIVO United screenshot..."
curl -X POST "https://api.firecrawl.dev/v1/screenshot" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.vivounited.org/",
    "fullPage": true,
    "formats": ["png"]
  }' > vivo-response.json

# ArtNgin screenshot  
echo "Capturing ArtNgin screenshot..."
curl -X POST "https://api.firecrawl.dev/v1/screenshot" \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://artngin.com/",
    "fullPage": true,
    "formats": ["png"]
  }' > artngin-response.json

echo "Screenshot requests submitted"
