import assert from 'node:assert/strict'
import test from 'node:test'

import { buildSnapshot } from '../tools/capture-pulse-snapshot.mjs'

const block100Hash = `0x${'10'.repeat(32)}`
const block101Hash = `0x${'11'.repeat(32)}`
const transaction1Hash = `0x${'21'.repeat(32)}`
const transaction2Hash = `0x${'22'.repeat(32)}`
const transaction3Hash = `0x${'23'.repeat(32)}`

const blocks = [
  {
    number: '0x64',
    hash: block100Hash,
    parentHash: `0x${'0f'.repeat(32)}`,
    timestamp: '0x65920080',
    transactions: [transaction1Hash, transaction2Hash],
    gasUsed: '0x64',
    gasLimit: '0x3e8',
  },
  {
    number: '0x65',
    hash: block101Hash,
    parentHash: block100Hash,
    timestamp: '0x65920081',
    transactions: [transaction3Hash],
    gasUsed: '0x12c',
    gasLimit: '0x3e8',
  },
]

test('buildSnapshot calculates the documented window metrics', () => {
  const snapshot = buildSnapshot({
    blocks,
    rpcUrl: 'https://rpc.testnet.arc.network',
    headSelection: 'fixed',
  })

  assert.deepEqual(snapshot.window, {
    firstBlock: 100,
    lastBlock: 101,
    blockCount: 2,
  })
  assert.deepEqual(snapshot.metrics, {
    totalTransactions: 3,
    meanTransactionsPerBlock: 1.5,
    sumGasUsed: 400,
    sumGasLimit: 2_000,
    gasUtilizationRatio: 0.2,
    gasUtilizationPercent: 20,
  })
  assert.equal(snapshot.network.chainId, 5_042_002)
  assert.equal(snapshot.capture.headSelection, 'fixed')
  assert.equal('generatedAtUtc' in snapshot.capture, false)
  assert.deepEqual(snapshot.blocks[0].transactionHashes, [transaction1Hash, transaction2Hash])
})

test('buildSnapshot rejects a discontinuous block lineage', () => {
  const invalid = structuredClone(blocks)
  invalid[1].parentHash = `0x${'ff'.repeat(32)}`

  assert.throws(
    () => buildSnapshot({ blocks: invalid, rpcUrl: 'https://rpc.testnet.arc.network', headSelection: 'fixed' }),
    /Parent hash mismatch/,
  )
})

test('fixed inputs produce byte-identical JSON', () => {
  const input = { blocks, rpcUrl: 'https://rpc.testnet.arc.network', headSelection: 'fixed' }
  assert.equal(JSON.stringify(buildSnapshot(input)), JSON.stringify(buildSnapshot(input)))
})

test('buildSnapshot rejects malformed transaction hashes', () => {
  const invalid = structuredClone(blocks)
  invalid[0].transactions[0] = '0x1'

  assert.throws(
    () => buildSnapshot({ blocks: invalid, rpcUrl: 'https://rpc.testnet.arc.network', headSelection: 'fixed' }),
    /invalid transaction hash/,
  )
})
