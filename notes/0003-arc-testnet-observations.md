# Arc testnet observations 0003: fixed source capture

**Status:** Source evidence verified; interface integration and checkpoint publication pending

**Network:** Arc Testnet (`5042002`)

**Method:** [Pulse v0 methodology](../methodology/pulse-v0-methodology.md), version 0.2

**Last updated:** 2026-08-10

## Observation question

What did a third deterministic 20-block Pulse capture show while StableSignal's private validation pipelines advanced?

The results describe one short Arc testnet window. The comparison below makes the source record legible; it does not establish a trend, adoption measure, service level, or mainnet expectation.

## Reproducibility record

| Field | Observation value |
| --- | --- |
| Capture start (UTC) | `2026-08-10T18:34:43.2264106Z` |
| Capture end (UTC) | `2026-08-10T18:34:43.8710969Z` |
| RPC host | `rpc.testnet.arc.network` - host only, no credentials |
| Capture implementation | public-research commit `e22b124f6b50208586c6b4133f687586e0043f41` |
| Head block | `56,319,570` at `2026-08-10T18:34:42Z` |
| Observed block range | `56,319,551-56,319,570` |
| Observed block count | `20` |
| Source snapshot | [`snapshots/pulse-v0-2026-08-10.json`](../snapshots/pulse-v0-2026-08-10.json) |
| Commit-pinned source | [`pulse-v0-2026-08-10.json`](https://raw.githubusercontent.com/StableSignal/public-research/e22b124f6b50208586c6b4133f687586e0043f41/snapshots/pulse-v0-2026-08-10.json) |
| SHA-256 | `e0035cc135c552a5bb866ed1a2a50e73146d9fc97e02d10548071ca3e3557714` |
| Interface QA | Pending; this is a source-only research record, not a Pulse interface release |

The selected head was captured twice using fixed-head mode. The two files were byte-identical, including block continuity, parent hashes, transaction hashes, and derived metrics. The immutable Git blob and the bytes served by the commit-pinned URL also produced the same SHA-256 digest.

## Results

| Metric | Value | Definition |
| --- | --- | --- |
| Total transactions | `197` | Sum of transaction counts across observed blocks |
| Mean transactions per block | `9.85` | `197 / 20` |
| Window gas utilization | `8.8%` | `52,931,190 / 600,000,000 x 100`, rounded to one decimal place |
| Head-block freshness | `1 second` | Capture start minus the fixed head-block timestamp, rounded to the nearest second |

## Bounded comparison

| Metric | Observation 0002 | Observation 0003 | Difference |
| --- | ---: | ---: | ---: |
| Transactions in 20 blocks | `149` | `197` | `+48` (`+32.2%`) |
| Mean transactions per block | `7.45` | `9.85` | `+2.40` |
| Window gas utilization | `3.4%` | `8.8%` | `+5.4` percentage points |

The third fixed window contained more transactions and used more gas than Observation 0002. Three point-in-time testnet samples are still too small and too irregular to establish direction, seasonality, demand, economic adoption, or production performance.

## Publication gate

- [x] UTC capture times recorded.
- [x] Chain ID confirmed as `5042002`.
- [x] Fixed block range and block count recorded.
- [x] Snapshot reproduced byte-identically at the fixed head.
- [x] Commit-pinned bytes returned HTTP `200` and matched the recorded SHA-256 digest.
- [x] Comparison language remains limited to point-in-time samples.
- [ ] Pulse interface integration and production browser QA.
- [ ] PulseBeacon checkpoint simulation, authorization, receipt, and event reconciliation.

No checkpoint transaction is claimed for Observation 0003. The source record remains useful without treating an unperformed release step as complete.

## Limitations

This is a short, point-in-time testnet observation. Test activity may be synthetic or intermittent, RPC responses can vary, and the capture does not establish continuous service behavior or a network trend.

All data and conclusions in this note concern Arc testnet and are experimental. StableSignal is an independent project. We are not affiliated with, endorsed by, or sponsored by Circle or Arc.
