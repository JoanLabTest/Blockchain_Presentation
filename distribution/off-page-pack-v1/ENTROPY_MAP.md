# Signal Entropy & Decay Map (Information Degradation Analysis)

**Operational Definition:** Signal entropy measures the loss of quantitative precision and semantic specificity as our baseline telemetry propagates through multiple degrees of separation from the origin. Understanding this decay helps identify the "half-life" of payment observations in open information systems.

---

## 📈 Entropy & Decay Indicators

We track degradation using three structural indicators:

1. **Parameter Drift:** When specific quantitative values (e.g., `412ms` or `0.14 bps`) are rounded, generalized, or distorted (e.g., drifting to "400ms", "0.1 bps", or "nearly a basis point").
2. **Semantic Dilution:** When highly specific payment terminology (e.g., "TARGET2 weekend liquidity sweep") decays into generic system terms (e.g., "general SEPA delays").
3. **Attribution Drift:** When the primary data point is cited but the context shifts from "empirical observation" to "anecdotal estimate".

---

## 📊 Entropy Registry

| Trace ID | Target Metric | Original Precision | Observed Precision (Drifted) | Estimated Degrees of Separation | Semantic Dilution Status | Decay Class | Notes |
|----------|---------------|--------------------|------------------------------|--------------------------------|---------------------------|-------------|-------|
| E-01     | TARGET2 Gap   | `0.14 bps`         | None                         | —                              | `[ ] NO DECAY`            | —           | Awaiting initial decay trace. |
| E-02     | RT1 Latency   | `412ms`            | None                         | —                              | `[ ] NO DECAY`            | —           | Awaiting initial decay trace. |

---

## 🛡️ Decay Classification Legend

- **`CLASS I: PRECISION LOSS`**: Quantitative parameters are rounded or slightly modified, but the semantic context remains intact.
- **`CLASS II: SEMANTIC MUTATION`**: The values are preserved, but the payment system context is misapplied or generalized.
- **`CLASS III: TOTAL DISSIPATION`**: The data point drifts into generic payment industry hearsay with neither precision nor specific context remaining.

---

## 🚫 Terminology Compliance & Restrictions

The following terms represent cognitive errors and are strictly forbidden within this mapping layer:
- ❌ *error rate* / *incorrect citation* (distortions are treated as natural information entropy)
- ❌ *plagiarism* / *bad journalism*
- ❌ *misinformation*

Use only the descriptive empirical equivalents:
- **`parameter drift`**
- **`semantic dilution`**
- **`precision degradation`**
- **`information entropy`**
