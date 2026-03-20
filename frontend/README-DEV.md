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

## Create multisig from the UI

1. Connect wallet on Rootstock (testnet/mainnet per `.env.local`).
2. Fill **owner addresses** and **required confirmations** (e.g. 2 of 3).
3. Click **Deploy new multisig** — confirm in wallet. The app switches to your new contract (saved in `localStorage`).
4. **Use default wallet (.env)** resets to `NEXT_PUBLIC_MULTISIG_ADDRESS`.

## Fund the contract before executing
Transactions are executed by transferring RBTC from the multisig contract balance. Before clicking **Execute**, make sure the active multisig contract (shown in the UI and in `NEXT_PUBLIC_MULTISIG_ADDRESS`) has RBTC.
Example contract to fund (from our debugging): `0x88cd3c3487fd872f3ad8658b9637bc963a62e059`.

If you change `MultiSigWallet.sol`, refresh deploy bytecode:

```bash
cd contracts && forge build && node scripts/export-frontend-bytecode.cjs
```
