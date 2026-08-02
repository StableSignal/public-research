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

Observation 0001 records the approved Pulse v0 QA capture, its bounded 20-block metrics, lookup fixtures, screenshot checksum, an independent RPC reconciliation, and the verified PulseBeacon deployment evidence.

## Publication standard

Every quantitative note should include the network and chain ID, UTC capture time, block range, RPC host identity without credentials, release version or commit, metric definitions, source-artifact paths, and known limitations. Derived charts must be reproducible from a committed snapshot or fully described query.

All research concerns Arc testnet unless a document explicitly says otherwise. Testnet activity is experimental and is not evidence of mainnet adoption, production performance, asset safety, or economic value.

StableSignal is an independent project. We are not affiliated with, endorsed by, or sponsored by Circle or Arc.
