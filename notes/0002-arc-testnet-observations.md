# Arc testnet observations 0002: fixed-window public beta capture

**Status:** Evidence verified; snapshot checkpoint published

**Network:** Arc Testnet (`5042002`)

**Method:** [Pulse v0 methodology](../methodology/pulse-v0-methodology.md), version 0.2

**Last updated:** 2026-08-04

## Observation question

What did a deterministic 20-block Pulse capture show during the public beta, and how did that fixed window differ from Observation 0001?

The results below describe one short Arc testnet window. The comparison is included to make the two observations legible, not to claim a trend.

## Reproducibility record

| Field | Observation value |
| --- | --- |
| Capture start (UTC) | `2026-08-04T20:58:17.786Z` |
| Capture end (UTC) | `2026-08-04T20:58:18.194Z` |
| RPC host | `rpc.testnet.arc.network` - host only, no credentials |
| Capture implementation | public-research commit `bce4bde34835a47bd1e0b7d2b6fb74cf3dc900eb` |
| Head block | `55,329,709` at `2026-08-04T20:57:51Z` |
| Observed block range | `55,329,690-55,329,709` |
| Observed block count | `20` |
| Source snapshot | [`snapshots/pulse-v0-2026-08-04.json`](../snapshots/pulse-v0-2026-08-04.json) |
| Commit-pinned source | [`pulse-v0-2026-08-04.json`](https://raw.githubusercontent.com/StableSignal/public-research/bce4bde34835a47bd1e0b7d2b6fb74cf3dc900eb/snapshots/pulse-v0-2026-08-04.json) |
| SHA-256 | `557d4dfb5fe1eb921e2322835a4b7d7100cf39144d82a04aa6c895df4f021d56` |

The fixed-head capture was repeated against the same 20 blocks. The second output was byte-identical to the first, including block continuity, parent hashes, transaction hashes, and derived metrics.

## Results

| Metric | Value | Definition |
| --- | --- | --- |
| Total transactions | `149` | Sum of transaction counts across observed blocks |
| Mean transactions per block | `7.45` | `149 / 20` |
| Window gas utilization | `3.4%` | `20,183,559 / 600,000,000 x 100`, rounded to one decimal place |
| Head-block freshness | `27 seconds` | Capture start minus the fixed head-block timestamp, rounded to the nearest second |

## Comparison with Observation 0001

| Metric | Observation 0001 | Observation 0002 | Difference |
| --- | ---: | ---: | ---: |
| Transactions in 20 blocks | `176` | `149` | `-27` (`-15.3%`) |
| Mean transactions per block | `8.8` | `7.45` | `-1.35` |
| Window gas utilization | `5.2%` | `3.4%` | `-1.8` percentage points |

The second fixed window had fewer transactions and lower gas utilization than the first. Two point-in-time testnet samples cannot establish direction, seasonality, demand, adoption, or production performance.

## Public address handoff

Pulse treats address inspection as an explorer handoff rather than an in-app balance or identity claim. The public PulseBeacon address used for the release check was [`0x13FBc37C40d071d9654913013C93a63F9Dc770D3`](https://testnet.arcscan.app/address/0x13FBc37C40d071d9654913013C93a63F9Dc770D3). No person, organization, balance, or protocol attribution is inferred from the address.

## PulseBeacon snapshot checkpoint

The exact commit-pinned snapshot bytes were published through PulseBeacon after a full Arc testnet simulation and an independent receipt and event check:

* Contract: [`0x13FBc37C40d071d9654913013C93a63F9Dc770D3`](https://testnet.arcscan.app/address/0x13FBc37C40d071d9654913013C93a63F9Dc770D3)
* SHA-256 digest: `0x557d4dfb5fe1eb921e2322835a4b7d7100cf39144d82a04aa6c895df4f021d56`
* Checkpoint transaction: [`0x07529544dc8192347ce87e2cd795f3b60125ca2f957a68187e5f416b3766dde7`](https://testnet.arcscan.app/tx/0x07529544dc8192347ce87e2cd795f3b60125ca2f957a68187e5f416b3766dde7)
* Block: `55,330,697` at `2026-08-04T21:06:14Z`
* Gas used: `28,850`
* Effective gas price: `21,500,000,000` wei
* Publication fee: `0.000620275 USDC`
* Receipt status: `1`

The transaction target, signer, chain ID, nonce, fee fields, digest, and URI were decoded before submission. The confirmed event address, indexed digest, decoded URI, timestamp, and publisher nonce were then reconciled independently from the Arc testnet RPC.

## Publication gate

* [x] UTC capture times recorded.
* [x] Chain ID confirmed as `5042002`.
* [x] Fixed block range and block count recorded.
* [x] Snapshot reproduced byte-identically at the fixed head.
* [x] Commit-pinned bytes returned HTTP `200` and matched the recorded SHA-256 digest.
* [x] Comparison language limited to two point-in-time samples.
* [x] Address handoff avoids identity and balance claims.
* [x] PulseBeacon receipt and emitted checkpoint values independently reconciled.
* [x] Testnet and independence notices retained.

## Limitations

This is a short, point-in-time testnet observation. Test activity may be synthetic or intermittent, scheduled snapshot delivery can be delayed, RPC responses can vary, and these two captures do not establish continuous service behavior or a network trend.

All data and conclusions in this note concern Arc testnet and are experimental. StableSignal is an independent project. We are not affiliated with, endorsed by, or sponsored by Circle or Arc.
