#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ARC_TESTNET_CHAIN_ID = 5_042_002
const DEFAULT_RPC_URL = 'https://rpc.testnet.arc.network'
const DEFAULT_BLOCK_COUNT = 20

function parseHexInteger(value, field) {
  if (typeof value !== 'string' || !/^0x[0-9a-f]+$/i.test(value)) {
    throw new Error(`${field} must be a hexadecimal RPC quantity`)
  }

  return BigInt(value)
}

function toSafeNumber(value, field) {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`${field} exceeds JavaScript's safe integer range`)
  }

  return Number(value)
}

function toIsoTimestamp(timestamp) {
  const milliseconds = toSafeNumber(timestamp, 'block timestamp') * 1_000
  return new Date(milliseconds).toISOString().replace('.000Z', 'Z')
}

function rpcHost(rpcUrl) {
  const parsed = new URL(rpcUrl)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('RPC URL must use HTTP or HTTPS')
  }

  return parsed.hostname
}

export function buildSnapshot({ blocks, rpcUrl, headSelection }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    throw new Error('At least one block is required')
  }

  const normalizedBlocks = blocks.map((block, index) => {
    if (!block || typeof block !== 'object') {
      throw new Error(`Block at index ${index} is missing`)
    }

    const number = parseHexInteger(block.number, `blocks[${index}].number`)
    const timestamp = parseHexInteger(block.timestamp, `blocks[${index}].timestamp`)
    const gasUsed = parseHexInteger(block.gasUsed, `blocks[${index}].gasUsed`)
    const gasLimit = parseHexInteger(block.gasLimit, `blocks[${index}].gasLimit`)

    if (gasLimit === 0n) {
      throw new Error(`Block ${number} has a zero gas limit`)
    }
    if (!Array.isArray(block.transactions)) {
      throw new Error(`Block ${number} does not contain a transaction list`)
    }
    if (typeof block.hash !== 'string' || typeof block.parentHash !== 'string') {
      throw new Error(`Block ${number} is missing a hash or parent hash`)
    }

    return {
      number: toSafeNumber(number, 'block number'),
      hash: block.hash,
      parentHash: block.parentHash,
      timestampUtc: toIsoTimestamp(timestamp),
      transactionCount: block.transactions.length,
      gasUsed: toSafeNumber(gasUsed, 'block gas used'),
      gasLimit: toSafeNumber(gasLimit, 'block gas limit'),
    }
  })

  for (let index = 1; index < normalizedBlocks.length; index += 1) {
    const previous = normalizedBlocks[index - 1]
    const current = normalizedBlocks[index]
    if (current.number !== previous.number + 1) {
      throw new Error('Block window is not contiguous and ascending')
    }
    if (current.parentHash.toLowerCase() !== previous.hash.toLowerCase()) {
      throw new Error(`Parent hash mismatch at block ${current.number}`)
    }
  }

  const totalTransactions = normalizedBlocks.reduce(
    (total, block) => total + block.transactionCount,
    0,
  )
  const sumGasUsed = normalizedBlocks.reduce((total, block) => total + block.gasUsed, 0)
  const sumGasLimit = normalizedBlocks.reduce((total, block) => total + block.gasLimit, 0)
  const firstBlock = normalizedBlocks[0]
  const headBlock = normalizedBlocks.at(-1)

  return {
    schemaVersion: 1,
    recordType: 'pulse-recent-block-capture',
    network: {
      name: 'Arc Testnet',
      chainId: ARC_TESTNET_CHAIN_ID,
      rpcHost: rpcHost(rpcUrl),
    },
    capture: {
      headSelection,
      headBlock: headBlock.number,
      headBlockHash: headBlock.hash,
      headBlockTimestampUtc: headBlock.timestampUtc,
    },
    window: {
      firstBlock: firstBlock.number,
      lastBlock: headBlock.number,
      blockCount: normalizedBlocks.length,
    },
    metrics: {
      totalTransactions,
      meanTransactionsPerBlock: totalTransactions / normalizedBlocks.length,
      sumGasUsed,
      sumGasLimit,
      gasUtilizationRatio: sumGasUsed / sumGasLimit,
      gasUtilizationPercent: (sumGasUsed / sumGasLimit) * 100,
    },
    blocks: normalizedBlocks,
    limitations: 'Point-in-time Arc testnet evidence; not a historical trend or production-service claim.',
  }
}

async function rpcCall(rpcUrl, method, params, id) {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  })

  if (!response.ok) {
    throw new Error(`RPC ${method} failed with HTTP ${response.status}`)
  }

  const payload = await response.json()
  if (payload.error) {
    throw new Error(`RPC ${method} failed: ${payload.error.message ?? 'unknown error'}`)
  }
  if (payload.result === undefined || payload.result === null) {
    throw new Error(`RPC ${method} returned no result`)
  }

  return payload.result
}

function parseArguments(argv) {
  const options = {
    rpcUrl: process.env.ARC_TESTNET_RPC_URL || DEFAULT_RPC_URL,
    blockCount: DEFAULT_BLOCK_COUNT,
    head: null,
    output: null,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    const value = argv[index + 1]

    if (argument === '--help') {
      options.help = true
    } else if (argument === '--rpc-url' && value) {
      options.rpcUrl = value
      index += 1
    } else if (argument === '--blocks' && value) {
      options.blockCount = Number(value)
      index += 1
    } else if (argument === '--head' && value) {
      options.head = value
      index += 1
    } else if (argument === '--output' && value) {
      options.output = value
      index += 1
    } else {
      throw new Error(`Unknown or incomplete argument: ${argument}`)
    }
  }

  if (!Number.isSafeInteger(options.blockCount) || options.blockCount < 1 || options.blockCount > 100) {
    throw new Error('--blocks must be an integer from 1 through 100')
  }
  if (options.head !== null && !/^\d+$/.test(options.head)) {
    throw new Error('--head must be a non-negative decimal block number')
  }
  rpcHost(options.rpcUrl)

  return options
}

function usage() {
  return `Capture a deterministic recent-block snapshot from Arc testnet.

Usage:
  node tools/capture-pulse-snapshot.mjs [options]

Options:
  --head <number>     Fix the head block for reproducible output (default: latest)
  --blocks <count>    Number of contiguous blocks, 1-100 (default: 20)
  --rpc-url <url>     Arc testnet RPC URL
  --output <path>     Write JSON to a file instead of stdout
  --help              Show this help
`
}

export async function captureSnapshot(options) {
  const chainIdHex = await rpcCall(options.rpcUrl, 'eth_chainId', [], 1)
  const chainId = toSafeNumber(parseHexInteger(chainIdHex, 'chain ID'), 'chain ID')
  if (chainId !== ARC_TESTNET_CHAIN_ID) {
    throw new Error(`Expected Arc testnet chain ID ${ARC_TESTNET_CHAIN_ID}, received ${chainId}`)
  }

  let headNumber
  let headSelection
  if (options.head === null) {
    const latestHex = await rpcCall(options.rpcUrl, 'eth_blockNumber', [], 2)
    headNumber = parseHexInteger(latestHex, 'latest block number')
    headSelection = 'latest-resolved-to-fixed-window'
  } else {
    headNumber = BigInt(options.head)
    headSelection = 'fixed'
  }

  const blockCount = BigInt(options.blockCount)
  if (headNumber + 1n < blockCount) {
    throw new Error('Requested window begins before block zero')
  }

  const firstNumber = headNumber - blockCount + 1n
  const requests = []
  for (let number = firstNumber; number <= headNumber; number += 1n) {
    requests.push(
      rpcCall(options.rpcUrl, 'eth_getBlockByNumber', [`0x${number.toString(16)}`, false], requests.length + 3),
    )
  }

  const blocks = await Promise.all(requests)
  return buildSnapshot({ blocks, rpcUrl: options.rpcUrl, headSelection })
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  if (options.help) {
    process.stdout.write(usage())
    return
  }

  const snapshot = await captureSnapshot(options)
  const json = `${JSON.stringify(snapshot, null, 2)}\n`

  if (options.output) {
    const outputPath = resolve(options.output)
    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, json, 'utf8')
    process.stdout.write(`Wrote Arc testnet blocks ${snapshot.window.firstBlock}-${snapshot.window.lastBlock} to ${outputPath}\n`)
  } else {
    process.stdout.write(json)
  }
}

const entryPoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null
if (entryPoint === import.meta.url) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  })
}
