#!/usr/bin/env node
/** Run from repo root: cd contracts && forge build && node scripts/export-frontend-bytecode.cjs */
const fs = require('fs')
const path = require('path')

const artifact = path.join(__dirname, '../out/MultiSigWallet.sol/MultiSigWallet.json')
const out = path.join(__dirname, '../../frontend/src/abi/MultiSigWallet.bytecode.ts')

const j = JSON.parse(fs.readFileSync(artifact, 'utf8'))
const bytecode = j.bytecode.object
if (!bytecode || !bytecode.startsWith('0x')) {
  console.error('Invalid bytecode — run forge build first')
  process.exit(1)
}
const content = `// Regenerated: cd contracts && forge build && node scripts/export-frontend-bytecode.cjs
export const MULTISIG_DEPLOY_BYTECODE = ${JSON.stringify(bytecode)} as \`0x\${string}\`
`
fs.writeFileSync(out, content)
console.log('Wrote', out)
