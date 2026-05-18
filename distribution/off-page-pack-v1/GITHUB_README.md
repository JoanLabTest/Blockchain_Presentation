# Eurosystem Settlement Telemetry (Q1 2026)

Raw telemetry and dataset snapshots tracking Eurozone settlement latency, specifically focusing on the TARGET2 weekend liquidity gap and SCT Inst/RT1 processing bottlenecks.

## Core Dataset

`eurosystem-baseline.json` provides the static, versioned snapshot of the metrics used to evaluate institutional liquidity migration. 

**Dataset URL:** `https://dcmcore.com/data/eurosystem-baseline.json`

## Key Observation: Weekend Asymmetry

During non-clearing windows (weekends), an asymmetrical liquidity imbalance appears between National Central Banks.

- **Data Source:** ECB TARGET2 Consolidated Reports (Q1 2026)
- **Observed Gap:** 0.14 bps exposure gap
- **Latency Peak:** Queued RT1 transactions peak at 412ms on Saturday 14:00 CET (vs. 15ms weekday baseline)

### Interpretation
The observed friction confirms that 24/7 tokenized asset settlement outpaces the discontinuous funding windows of traditional TARGET2 liquidity accounts. Algorithms dependent on weekend sweeps experience up to 45 minutes of liquidity dry spells.

## Usage

This dataset and its observations are released under BY-NC-ND 4.0. You may use this repository's JSON endpoint directly in your simulations for tokenized Delivery-versus-Payment (DvP) stress testing.
