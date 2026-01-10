# Running the Dev Server

## If the server seems to stop:

1. **The server is likely still running** - the "○ Compiling / ..." message means it's waiting for a browser request.

2. **Open your browser** and go to: `http://localhost:3000`

3. **The terminal should show** "✓ Compiled" when you visit the page.

## If it actually exits:

Run with logging:
```bash
npm run dev 2>&1 | tee server.log
```

Then check `server.log` for errors.

## To verify server is running:

In a NEW terminal:
```bash
ps aux | grep "next dev" | grep -v grep
lsof -ti:3000
```

If you see output, the server IS running.
