# Pulse v0 methodology

**Version:** 0.2

**Network:** Arc Testnet (`5042002`)

**Last updated:** 2026-08-04

**Release state:** Public-beta observation protocol

## Purpose

Pulse v0 provides a bounded, point-in-time view of recent Arc testnet activity. This document defines how a release observation is captured and how its basic metrics are calculated. It is intentionally narrower than a historical indexer or production monitoring specification.

## Evidence layers

Pulse records three distinct layers:

* **Observed data** — values returned by the configured Arc testnet RPC and preserved in the recorded capture window.
* **Derived metrics** — deterministic calculations from those observed values.
* **Interpretation** — a separately labeled statement limited to what the capture supports.

An interpretation must not be presented as a direct observation. A single short testnet window must not be described as a durable network trend.

## Network and source

Before capture, the client must confirm that the RPC reports chain ID `5042002`. The reproducibility record identifies the RPC host but excludes credentials, private URLs containing secrets, and local environment values.

The capture CLI reads current public chain state and writes a validated, deterministic JSON snapshot. The public Pulse interface reads the latest successfully deployed snapshot from its own origin because the Arc testnet RPC does not currently authorize cross-origin requests from the GitHub Pages host. Scheduled publication is best effort, so Pulse displays the head-block time and explicitly marks an older capture as delayed.

Pulse does not submit transactions, manage keys, or depend on PulseBeacon to retrieve dashboard data. PulseBeacon is a separate public proof artifact used to anchor reviewed observation bytes.

## Capture procedure

1. Record the release version or source commit and the QA environment.
2. Record capture start in UTC and confirm RPC chain ID `5042002`.
3. Resolve a head block, then re-run the capture with that exact head and the documented block count.
4. Validate the snapshot schema, contiguous ascending block numbers, parent-hash lineage, and transaction hashes.
5. Independently re-read the fixed window and confirm byte-identical output and reconciled metrics.
6. Confirm that sampled block and transaction explorer references resolve to the matching Arc testnet records.
7. Record capture end in UTC and commit the immutable source snapshot before checkpoint preparation.
8. Run production browser QA against the published snapshot, including freshness, delayed, empty, address-handoff, keyboard, and safe external-link states.

The release note must state the number of blocks in the displayed window. If the interface changes that window, the methodology version or release record must capture the change.

## Metric definitions

### Transactions per block

The transaction count for block `b` is the number of transaction entries returned for that block:

`tx_count(b) = count(transactions in b)`

For an observation window, total transactions are the sum of block transaction counts. The arithmetic mean is reported only when both the block count and total are also available:

`mean_tx_per_block = total_transactions / observed_blocks`

### Gas utilization

Gas utilization for a block is:

`gas_utilization(b) = gas_used(b) / gas_limit(b) × 100`

Window-level gas utilization uses the ratio of sums, not the unweighted average of per-block percentages:

`window_gas_utilization = sum(gas_used) / sum(gas_limit) × 100`

A zero or missing gas limit produces no utilization value and must be reported as unavailable rather than zero.

### Capture freshness

When reported, capture freshness is the difference between the UTC capture time and the timestamp of the recorded head block. It describes the observation only; it is not a claim about finality or network health.

## Address lookups

Wallet and contract inputs are inspection aids. The public beta validates the address and hands the reader to the Arc testnet explorer; it does not proxy arbitrary balance, transaction-count, or bytecode reads. An address is not attributed to a person, organization, or protocol without a cited public source.

## Required reproducibility record

Every published Pulse observation includes:

| Field | Requirement |
| --- | --- |
| Network | Arc Testnet |
| Chain ID | `5042002` |
| Capture start and end | UTC timestamps |
| Head block | Block number at capture start |
| Observed range | First block, last block, and block count |
| RPC source | Host name only; no credentials |
| Release identity | Version or source commit |
| QA environment | Browser and viewport used for production verification |
| Evidence | Source-snapshot path and screenshot path when a screenshot is retained |
| Calculations | Metric names, units, and rounding policy |

## Rounding

Counts remain integers. Percentages are calculated from unrounded source values and may be displayed to one decimal place. Timestamps are recorded in UTC using ISO 8601.

## Quality checks

Before publication:

* the RPC chain ID must match `5042002`;
* the fixed-head capture must reproduce byte-identically from the same RPC response window;
* every displayed block and transaction sampled during QA must match its explorer record;
* totals must reconcile to the captured block rows;
* missing RPC fields must remain visibly unavailable rather than converted to zero;
* the observation note and source snapshot must identify the same capture window;
* a checkpoint digest must match the immutable commit-pinned snapshot bytes; and
* deployment evidence must match the StableSignal Arc testnet registry.

## Limitations

* Testnet activity is experimental and may be synthetic, intermittent, or reset.
* The recent-block window is a sample, not a historical activity series.
* RPC responses can vary with provider availability, caching, head movement, or short-lived reorganization.
* Scheduled publication can be delayed or skipped by the hosting platform; the displayed observation time is authoritative.
* A screenshot supports what was visible at capture time; it does not prove continuous availability.
* Explorer labels and contract heuristics can be incomplete.
* Pulse v0 does not measure economic adoption, mainnet readiness, asset safety, finality guarantees, or production service levels.

## Change policy

Material changes to the block window, metric formulas, capture source, delivery model, or lookup behavior require a methodology version update. Version 0.2 records the move from direct browser RPC reads to a same-origin published snapshot and explorer handoff. Corrections should preserve the original note and state what changed.

StableSignal is an independent project building on Arc testnet. We are not affiliated with, endorsed by, or sponsored by Circle or Arc.
