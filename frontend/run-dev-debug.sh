#!/bin/bash
echo "Starting Next.js with full error output..."
npm run dev 2>&1 | while IFS= read -r line; do
    echo "$line"
    if echo "$line" | grep -qE "(Error|error|Failed|failed|✗|TypeError|ReferenceError)"; then
        echo ">>> ERROR DETECTED <<<"
    fi
done
