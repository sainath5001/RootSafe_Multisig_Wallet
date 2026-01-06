#!/bin/bash

# Script to copy ABI from Foundry output to frontend
# Usage: ./scripts/copy-abi.sh

CONTRACTS_DIR="../contracts"
ABI_SOURCE="$CONTRACTS_DIR/out/MultiSigWallet.sol/MultiSigWallet.json"
ABI_DEST="src/abi/MultiSigWallet.json"
TEMP_FILE="src/abi/MultiSigWallet.temp.json"

echo "📋 Copying ABI from Foundry output..."

# Check if source exists
if [ ! -f "$ABI_SOURCE" ]; then
    echo "❌ Error: ABI source file not found at $ABI_SOURCE"
    echo "   Make sure you've compiled the contracts with 'forge build'"
    exit 1
fi

# Create abi directory if it doesn't exist
mkdir -p src/abi

# Copy the full artifact temporarily
cp "$ABI_SOURCE" "$TEMP_FILE"

# Extract just the ABI using Node.js
if command -v node &> /dev/null; then
    node -e "
        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync('$TEMP_FILE', 'utf8'));
        fs.writeFileSync('$ABI_DEST', JSON.stringify(data.abi, null, 2));
        console.log('✅ ABI extracted successfully!');
    "
    
    # Remove temp file
    rm "$TEMP_FILE"
    
    echo "✅ ABI copied to $ABI_DEST"
else
    echo "❌ Error: Node.js is required to extract ABI"
    echo "   Please install Node.js or manually extract the 'abi' field from the JSON file"
    exit 1
fi


