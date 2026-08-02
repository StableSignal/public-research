# Pulse v0 methodology

**Version:** 0.1 draft

**Network:** Arc Testnet (`5042002`)

**Last updated:** 2026-08-01

**Release state:** QA and PulseBeacon deployment evidence captured

## Purpose

Pulse v0 provides a bounded, point-in-time view of recent Arc testnet activity. This document defines how a release observation is captured and how its basic metrics are calculated. It is intentionally narrower than a historical indexer or production monitoring specification.

## Evidence layers

Pulse records three distinct layers:

* **Observed data** — values returned by the configured Arc testnet RPC during the recorded capture window.
* **Derived metrics** — deterministic calculations from those observed values.
* **Interpretation** — a separately labeled statement limited to what the capture supports.

An interpretation must not be presented as a direct observation. A single short testnet window must not be described as a durable network trend.

## Network and source

Before capture, the client must confirm that the RPC reports chain ID `5042002`. The reproducibility record identifies the RPC host but excludes credentials, private URLs containing secrets, and local environment values.

Pulse v0 reads current public chain state. It does not submit transactions, manage keys, or depend on PulseBeacon to retrieve dashboard data. PulseBeacon is a separate public proof artifact for the release.

## Capture procedure

1. Record the release version or source commit and the QA environment.
2. Record the start time in UTC and confirm RPC chain ID `5042002`.
3. Record the latest block number returned at capture start.
4. Load the bounded recent-block window displayed by the release candidate.
5. Record the displayed block identifiers, timestamps, transaction counts, gas used, and gas limits.
6. Check the recent transaction feed and the wallet and contract lookup paths used during QA.
7. Confirm that outbound explorer references resolve to the matching Arc testnet records.
8. Record the end time in UTC, save the approved screenshot, and preserve any publishable source snapshot used for calculations.

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

Wallet and contract lookups are inspection aids. An address is not attributed to a person, organization, or protocol without a cited public source. Contract classification must be based on the lookup result used by the release candidate and must not be treated as source-code verification.

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
| QA environment | Browser and viewport used for the approved capture |
| Evidence | Screenshot path and source-snapshot path, if retained |
| Calculations | Metric names, units, and rounding policy |

## Rounding

Counts remain integers. Percentages are calculated from unrounded source values and may be displayed to one decimal place. Timestamps are recorded in UTC using ISO 8601.

## Quality checks

Before publication:

* the RPC chain ID must match `5042002`;
* every displayed block and transaction sampled during QA must match its explorer record;
* totals must reconcile to the captured block rows;
* missing RPC fields must remain visibly unavailable rather than converted to zero;
* the screenshot, observation note, and any saved snapshot must identify the same capture window; and
* deployment evidence must match the StableSignal Arc testnet registry.

## Limitations

* Testnet activity is experimental and may be synthetic, intermittent, or reset.
* The recent-block window is a sample, not a historical activity series.
* RPC responses can vary with provider availability, caching, head movement, or short-lived reorganization.
* A screenshot supports what was visible at capture time; it does not prove continuous availability.
* Explorer labels and contract heuristics can be incomplete.
* Pulse v0 does not measure economic adoption, mainnet readiness, asset safety, finality guarantees, or production service levels.

## Change policy

Material changes to the block window, metric formulas, data source, or lookup classification require a methodology version update. Corrections should preserve the original note and state what changed.

StableSignal is an independent project building on Arc testnet. We are not affiliated with, endorsed by, or sponsored by Circle or Arc.
