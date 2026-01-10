#!/bin/bash
echo "Starting server in background..."
npm run dev > /tmp/nextjs-server.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"
echo "Waiting 15 seconds for server to start..."
sleep 15

if ps -p $SERVER_PID > /dev/null; then
    echo "✓ Server is running (PID: $SERVER_PID)"
    echo "✓ Open http://localhost:3000 in your browser"
    echo ""
    echo "To stop the server, run: kill $SERVER_PID"
    echo "Or press Ctrl+C and run: pkill -f 'next dev'"
    echo ""
    echo "Server logs are in: /tmp/nextjs-server.log"
    echo "To view logs: tail -f /tmp/nextjs-server.log"
else
    echo "✗ Server stopped/crashed"
    echo "Last 50 lines of log:"
    tail -50 /tmp/nextjs-server.log
fi
