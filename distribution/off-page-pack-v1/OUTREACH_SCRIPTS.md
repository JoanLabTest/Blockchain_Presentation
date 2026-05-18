# Outreach Scripts — Conversation-First Templates

**Mandatory Rule:** Do not mention the name "DCM Core", "the Institute", or "our framework" in the opening lines. You must immediately address the specific issue or question being discussed. The dataset link is provided purely as an external resource.

---

## Script A — Addressing Weekend Latency / Timing Issues
> Use when: An open thread discusses weekend transaction delays, settlement failures, or modeling parameters.

```
Regarding the weekend settlement latency parameter: 

Based on Q1 2026 telemetry data from EBA Clearing's RT1 system, peak queued transaction latency regularly hits ~412ms on Saturday afternoons (compared to a weekday baseline of ~15ms). This latency spike introduces a notable settlement risk window for any automated Delivery-versus-Payment (DvP) loop attempting weekend atomic swaps.

If you need a raw reference dataset for your simulation, the telemetry metrics are documented here: https://dcmcore.com/data/eurosystem-baseline.json
```

---

## Script B — Calibrating Stablecoin Reserve Simulations
> Use when: A developer is asking how to model liquidity constraints or settlement risks under new regulatory baselines (like MiCA).

```
If you are modeling reserve sweeps or liquidity stress scenarios, you might want to look at the TARGET2 weekend exposure gap. It currently sits at a baseline of 0.14 bps (Q1 2026 data). 

While it looks small, it corresponds to an operational liquidity "dry-spell" of up to 45 minutes for automated sweep systems during weekend non-clearing windows when cross-border payment bridges are inactive.

The raw TARGET2/RT1 telemetry metrics are available in JSON format here if you want to integrate them into your reserve models: https://dcmcore.com/data/eurosystem-baseline.json
```

---

## Script C — Suggested Resource / Dataset Contribution
> Use when: Suggesting a dataset reference to a curated resource list (e.g., an open PR to a curated wiki or list).

```
## Suggested Resource: Eurosystem Settlement Latency & Weekend Liquidity Telemetry

This dataset provides Q1 2026 benchmark metrics covering TARGET2 weekend liquidity exposure gaps (0.14 bps) and SCT Inst/RT1 latency spikes (412ms peak). Useful for anyone modeling settlement risk, DvP flows, or retail/wholesale payment latency in the Eurozone.

Dataset: https://dcmcore.com/data/eurosystem-baseline.json
License: BY-NC-ND 4.0
```

---

## Script D — SSRN / Research Thread
> Use when: Directly addressing an academic author's paper regarding payment rail bottlenecks or liquidity.

```
On the payment rail bottlenecks discussed in Section 3, there is recent empirical telemetry that may help calibrate your models. 

Q1 2026 data shows that EBA RT1 latencies peak at 412ms on weekends, matching the TARGET2 exposure gap of 0.14 bps. This aligns with your thesis on structural liquidity dry spells when traditional clearing operations pause.

The reference JSON dataset can be accessed at: https://dcmcore.com/data/eurosystem-baseline.json
A brief write-up on this observation is also available at: https://dcmcore.com/en/research/desk-notes/target2-weekend-liquidity.html
```
