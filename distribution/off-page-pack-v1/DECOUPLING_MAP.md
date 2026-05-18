# Signal Decoupling Map (Signal Persistence Without Origin Tracking)

**Operational Definition:** Decoupling occurs when an empirical observation or dataset snippet (e.g., TARGET2 0.14 bps gap, RT1 412ms latency spike) propagates through external environments with the origin link (`dcmcore.com` or `eurosystem-baseline.json`) stripped or omitted. This indicates the signal has transitioned from "cited research" into the ecosystem's background baseline knowledge.

---

## 📈 Decoupling Indicators

We log decoupling traces using three factual observations:

1. **Anonymous Recurrence:** The specific metrics are quoted or integrated into external codebases, papers, or threads without any reference to our domain.
2. **Structural Mutation:** The data parameters are modified or incorporated into broader payment models, but retain our unique original baseline values (e.g., exactly `412ms` or `0.14 bps`).
3. **Indirect Attribution:** Third-party sources quote a secondary source citing our observation, creating a chain of custody where our original origin is invisible.

---

## 📊 Decoupling Registry

| Trace ID | Target Metric / Concept | Decoupled Context (URL / Codebase) | Observed Mutation | Detection Date | Verification Status | Notes |
|----------|-------------------------|------------------------------------|-------------------|----------------|---------------------|-------|
| D-01     | TARGET2 0.14 bps weekend gap | None                               | —                 | 2026-05-18     | `[ ] NO DECOUPLING` | Awaiting initial trace detection. |
| D-02     | EBA RT1 412ms weekend tax    | None                               | —                 | 2026-05-18     | `[ ] NO DECOUPLING` | Awaiting initial trace detection. |

---

## 🚫 Terminology Compliance & Restrictions

The following terms represent cognitive errors and are strictly forbidden within this mapping layer:
- ❌ *adoption rate*
- ❌ *viral spread*
- ❌ *intellectual theft* / *plagiarism* (this is a positive decoupling indicator, not a violation)
- ❌ *reputation impact*

Use only the descriptive empirical equivalents:
- **`anonymous recurrence`** (reference without origin link)
- **`structural mutation`** (data parameters modified or re-fit into other models)
- **`decoupled persistence`** (the signal continues to survive independent of the source)
