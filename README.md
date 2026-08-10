# StableSignal Public Research

Public methodology, observations, snapshots, and charts for StableSignal research on Arc testnet.

This repository keeps three layers separate:

1. **Methodology** defines how data is collected, calculated, and checked.
2. **Observation notes** report dated testnet evidence without treating a short sample as a durable trend.
3. **Interpretation** is labeled and limited to what the recorded evidence supports.

## Repository layout

* `methodology/` — versioned collection and calculation methods.
* `notes/` — dated observations tied to reproducibility records.
* `snapshots/` — machine-readable source captures when publication is appropriate.
* `charts/` — derived visuals with their source and transformation documented.

## Pulse v0 release record

* [Methodology](methodology/pulse-v0-methodology.md)
* [Observation 0001](notes/0001-arc-testnet-observations.md)
* [Observation 0001 machine-readable snapshot](snapshots/pulse-v0-2026-07-31.json)
* [Observation 0002](notes/0002-arc-testnet-observations.md)
* [Observation 0002 machine-readable snapshot](snapshots/pulse-v0-2026-08-04.json)
* [Observation 0003 source note](notes/0003-arc-testnet-observations.md)
* [Observation 0003 machine-readable snapshot](snapshots/pulse-v0-2026-08-10.json)

Observation 0001 records the Pulse v0 release baseline. Observation 0002 adds the public-beta fixed-window protocol, a byte-identical reproduction, a deliberately limited two-sample comparison, the public explorer handoff, and the second verified PulseBeacon snapshot checkpoint. Observation 0003 records a third byte-identical fixed capture and its verified PulseBeacon snapshot checkpoint while keeping interface integration explicitly pending.

## Reproduce a recent-block capture

Node.js 20 or newer can capture the same bounded metrics and recent transaction hashes directly from the public Arc testnet RPC without installing dependencies:

```powershell
node .\tools\capture-pulse-snapshot.mjs --output .\snapshots\pulse-latest.json
```

The default window is the latest 20 contiguous blocks. For byte-stable reproduction, pin the head block; the output deliberately excludes the wall-clock generation time:

```powershell
node .\tools\capture-pulse-snapshot.mjs `
  --head 54646241 `
  --blocks 20 `
  --output .\snapshots\pulse-block-54646241.json
```

The script confirms Arc testnet chain ID `5042002`, validates block continuity, parent hashes, and transaction hashes, and calculates total transactions, mean transactions per block, and ratio-of-sums gas utilization. It stores only the RPC host name in the snapshot. `ARC_TESTNET_RPC_URL` or `--rpc-url` may select another Arc testnet RPC.

The public Pulse deployment runs this capture on a GitHub Pages schedule and serves the resulting JSON from the same origin as the interface. This avoids relying on browser access to an RPC endpoint that does not currently authorize cross-origin requests from GitHub Pages.

Run its dependency-free tests with:

```powershell
node --test .\test\capture-pulse-snapshot.test.mjs
```

## Publication standard

Every quantitative note should include the network and chain ID, UTC capture time, block range, RPC host identity without credentials, release version or commit, metric definitions, source-artifact paths, and known limitations. Derived charts must be reproducible from a committed snapshot or fully described query.

All research concerns Arc testnet unless a document explicitly says otherwise. Testnet activity is experimental and is not evidence of mainnet adoption, production performance, asset safety, or economic value.

StableSignal is an independent project. We are not affiliated with, endorsed by, or sponsored by Circle or Arc.
