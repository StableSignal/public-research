# Arc testnet observations 0001: Pulse v0 release baseline

**Status:** Release evidence verified; snapshot checkpoint published

**Network:** Arc Testnet (`5042002`)

**Method:** [Pulse v0 methodology](../methodology/pulse-v0-methodology.md)

**Last updated:** 2026-08-02

## Observation question

What did Pulse v0 display for a bounded recent-block window during its approved release-candidate QA capture?

This note records the approved Pulse v0 release-candidate capture. The activity statement below is limited to this fixed Arc testnet window and is not a broader network trend claim.

## Reproducibility record

| Field | Release value |
| --- | --- |
| Capture start (UTC) | `2026-07-31T19:52:07Z` — page's displayed update time |
| Capture end (UTC) | `2026-07-31T19:52:24.7819425Z` — screenshot file time |
| RPC host | `rpc.testnet.arc.network` — host only, no credentials |
| Release version or commit | Pulse v0 release candidate; working tree based on `1ae911bec1846e21083a2bcffbc4bef2a2cd452a` |
| QA browser and viewport | Microsoft Edge through browser control; requested `1440×1000`, measured CSS viewport `1425×1000`, saved image `1425×990` |
| Head block at capture start | `54,646,241` |
| Observed block range | `54,646,222–54,646,241` |
| Observed block count | `20` |
| Approved screenshot | `https://stablesignal.github.io/assets/screenshots/pulse-v0-2026-07-31.png`; SHA-256 `25d4cf1051af4ac0f3eafe3c0a6569f3e8902a1ff65c20b6d0da155624b76eb7` |
| Source snapshot | [`snapshots/pulse-v0-2026-07-31.json`](../snapshots/pulse-v0-2026-07-31.json) |

## Results

| Metric | Value | Definition |
| --- | --- | --- |
| Total transactions | `176` | Sum of transaction counts across observed blocks |
| Mean transactions per block | `8.8` | `176 / 20` |
| Window gas utilization | `5.2%` | `31,262,354 / 600,000,000 × 100`, rounded to one decimal place |
| Head-block freshness | `1 second` | Displayed update time minus head-block timestamp `2026-07-31T19:52:06Z` |

The transaction and gas totals were independently recomputed by re-reading the fixed block range from the public Arc testnet RPC. They reconcile to the approved capture and retained snapshot.

## Lookup checks

The QA record identifies one public wallet-address lookup and one public contract-address lookup. Neither address is attributed to a person, organization, or protocol.

* Wallet lookup checked: [`0x95BBab0a10a247f46716081A6311fbf8345AbCE2`](https://testnet.arcscan.app/address/0x95BBab0a10a247f46716081A6311fbf8345AbCE2) — `20 USDC`, transaction count `0`, externally owned account.
* Contract lookup checked: [`0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a`](https://testnet.arcscan.app/address/0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a) — `832.654694 USDC`, transaction count `1`, `1,798` bytes of runtime code.
* Sampled explorer links matched: **Yes**, including [head block 54,646,241](https://testnet.arcscan.app/block/54646241).

## Interpretation

Pulse displayed `176` transactions across the latest `20` blocks at capture time, an arithmetic mean of `8.8` transactions per block. The same window used `5.2%` of its aggregate gas limit. These values describe only the recorded testnet window; they do not establish a durable trend, production performance, adoption, or mainnet readiness.

## PulseBeacon deployment evidence

PulseBeacon is a separate public proof artifact and is not required for Pulse to read dashboard data. Its Arc testnet deployment was checked against the RPC, the contract's immutable publisher, and ArcScan:

* Contract: [`0x13FBc37C40d071d9654913013C93a63F9Dc770D3`](https://testnet.arcscan.app/address/0x13FBc37C40d071d9654913013C93a63F9Dc770D3)
* Deployment transaction: [`0x34294c78a7062f1088724d2017149d2531c6a522c666304c09e950694338ebf0`](https://testnet.arcscan.app/tx/0x34294c78a7062f1088724d2017149d2531c6a522c666304c09e950694338ebf0)
* Block: `54,976,300` at `2026-08-02T18:37:09Z`
* Receipt status: `1`
* Publisher: `0x95BBab0a10a247f46716081A6311fbf8345AbCE2`
* Runtime code: `1,014` bytes
* Deployment fee: `0.0060052094136 USDC`

The same values are recorded in the StableSignal public hub's machine-readable Arc testnet deployment registry.

## PulseBeacon snapshot checkpoint

The exact snapshot bytes from public-research commit `b2467a2e0008941c9dd1370426f9c6a886415d63` are anchored by the first PulseBeacon checkpoint:

* SHA-256 digest: `0xbeae9dc6916516bd71591dfc2038e013a6a715f3b5ff0fc05e40eb943b71c00d`
* Commit-pinned source: [`pulse-v0-2026-07-31.json`](https://raw.githubusercontent.com/StableSignal/public-research/b2467a2e0008941c9dd1370426f9c6a886415d63/snapshots/pulse-v0-2026-07-31.json)
* Checkpoint transaction: [`0xe097a6ec452a215f6733751149f412928022547da95b554c1252e1504c3e99ae`](https://testnet.arcscan.app/tx/0xe097a6ec452a215f6733751149f412928022547da95b554c1252e1504c3e99ae)
* Block: `54,994,297` at `2026-08-02T21:10:55Z`
* Receipt status: `1`

The emitted event digest matches the SHA-256 digest above. The digest is calculated from the immutable Git blob served by the commit-pinned raw URL; a working-tree copy may hash differently if a Git client rewrites line endings.

## Publication gate

* [x] UTC capture times recorded.
* [x] Chain ID confirmed as `5042002`.
* [x] Release identity and QA environment recorded.
* [x] Block range and block count recorded.
* [x] Metrics independently reconciled.
* [x] Screenshot path and checksum recorded.
* [x] Sampled explorer references match displayed records.
* [x] PulseBeacon evidence matches the public deployment registry.
* [x] Snapshot digest and published PulseBeacon event match.
* [x] Testnet and independence notices retained.

## Limitations

This is a short, point-in-time testnet observation. Test activity may be synthetic or intermittent, the chain head can advance during capture, RPC responses can vary, and a screenshot does not establish continuous service behavior.

All data and conclusions in this note concern Arc testnet and are experimental. StableSignal is an independent project. We are not affiliated with, endorsed by, or sponsored by Circle or Arc.
