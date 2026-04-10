#!/usr/bin/env node
/**
 * Writes `frontend/src/abi/MultiSigWallet.json` as a plain ABI array from Foundry output.
 *
 * Usage (from repo root):
 *   cd contracts && forge build && cd .. && node frontend/scripts/sync-abi.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.join(__dirname, '..', '..')
const artifactPath = path.join(repoRoot, 'contracts/out/MultiSigWallet.sol/MultiSigWallet.json')
const outPath = path.join(__dirname, '../src/abi/MultiSigWallet.json')

if (!fs.existsSync(artifactPath)) {
  console.error('Missing:', artifactPath)
  console.error('Run `forge build` in contracts/ first.')
  process.exit(1)
}

const { abi } = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
fs.writeFileSync(outPath, JSON.stringify(abi, null, 2) + '\n')
console.log('OK:', outPath, '<-', artifactPath)
