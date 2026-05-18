# Outreach Scripts — Non-Promotional Templates

**Rule:** Every message must start with a genuine response to the existing discussion. The dataset link is always the *last* sentence, never the opening pitch.

---

## Script A — GitHub Issue Reply (Latency / Settlement Context)

> Use when: Someone has opened an Issue about settlement timing, latency parameters, or weekend processing gaps.

---

```
Good point on the weekend settlement risk. One concrete data reference that might be useful for your calibration:

The EBA Clearing RT1 system shows a consistent latency spike on Saturday afternoons — averaging ~412ms vs. a ~15ms weekday baseline (based on Q1 2026 telemetry). This directly impacts atomic DvP models that assume near-instant cash leg settlement.

If helpful, there's a raw JSON baseline here with the TARGET2 and RT1 metrics: https://dcmcore.com/data/eurosystem-baseline.json
```

---

## Script B — GitHub Issue / Discussion (MiCA / Stablecoin Reserve Models)

> Use when: A developer is discussing reserve requirements or liquidity risk modeling for a MiCA-compliant stablecoin.

---

```
Worth noting for your reserve model: the TARGET2 weekend exposure gap is currently sitting at 0.14 bps (Q1 2026 data). That might seem negligible, but for an automated sweep algorithm trying to pre-fund weekend positions, it represents a real dry-spell window of up to 45 minutes when cross-border liquidity is unavailable.

If you're stress-testing reserve scenarios against this, the raw baseline is publicly available: https://dcmcore.com/data/eurosystem-baseline.json
```

---

## Script C — GitHub PR Description (Adding to a Curated List)

> Use when: Submitting a PR to an `awesome-*` list or a resource wiki.

---

```
## Add: Eurosystem Settlement Telemetry Dataset

**Resource:** Eurosystem Empirical Baseline Dataset (Q1 2026)
**Link:** https://dcmcore.com/data/eurosystem-baseline.json
**What it contains:** TARGET2 weekend liquidity gap (0.14 bps), SCT Inst / RT1 latency baselines (412ms peak), and €STR overnight rate anchors.
**License:** BY-NC-ND 4.0

This dataset is useful for anyone building DvP simulations, stablecoin reserve models, or SEPA Instant latency benchmarks. Adding it under the "Settlement & Liquidity Data" section.
```

---

## Script D — SSRN Comment (Academic / Paper Context)

> Use when: Commenting on a working paper that mentions European settlement, liquidity migration, or tokenized bonds.

---

```
Thank you for this paper. On the settlement friction point in Section 3, you may find the Q1 2026 Eurosystem baseline dataset a useful supplementary source. It documents the TARGET2 weekend exposure gap (0.14 bps) and RT1 latency spikes empirically, which aligns with your model's assumptions.

Dataset: https://dcmcore.com/data/eurosystem-baseline.json

A short observation note is also available here: https://dcmcore.com/en/research/desk-notes/target2-weekend-liquidity.html
```

---

## Script E — Substack / Medium Comment Reply

> Use when: Replying to a newsletter or article about tokenized finance, European payments, or CBDC.

---

```
The weekend gap you describe is measurable. Q1 2026 telemetry shows the RT1 peak latency hitting 412ms on Saturday afternoons vs. ~15ms on weekdays — which is precisely the window where a tokenized DvP swap can fail its settlement SLA.

Raw dataset for anyone wanting to model this: https://dcmcore.com/data/eurosystem-baseline.json
```

---

## ❌ Anti-Patterns — Never Use

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| "Hi! We built a system..." | Start with their specific problem |
| "Our institute has research..." | "The data shows..." |
| "Check out DCM Core for..." | Link appears last, as a resource |
| Generic copy-paste | Adapt the first sentence to the exact thread |
| Sending to an unrelated repo | Only where the data is genuinely useful |

---

## Timing Protocol

- **Wait 24h** between each outreach action within the same repository.
- **Max 2 outreach actions** per repository (Issue reply + PR, or two different Issues).
- **Never** create an Issue whose sole purpose is promotion — always respond to existing threads.
