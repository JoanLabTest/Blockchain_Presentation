# Citation Snippets (Data-First)

These snippets are designed to be easily copy-pasted into external GitHub repositories, Medium articles, SSRN abstracts, and academic notes.

## 1. GitHub / README Snippet (Markdown)

```markdown
### Telemetry Data
This project relies on the [Eurosystem Empirical Baseline Dataset](https://dcmcore.com/data/eurosystem-baseline.json) for its baseline metrics, specifically the Q1 2026 observations on TARGET2 weekend liquidity gaps (0.14 bps) and SCT Inst processing latency profiles.
```

## 2. SSRN / Academic Abstract (Plain Text)

```text
Drawing upon recent empirical telemetry (Signal 01: TARGET2 Weekend Liquidity Asymmetry, 2026), this paper explores the hidden costs of discontinuous settlement windows on tokenized asset markets. Raw baseline data provided by dcmcore.com.
```

## 3. Inline Technical Comment (Python / Smart Contract)

```python
# Note: Rehypothecation limits below are calibrated against the Q1 2026 
# Eurosystem Baseline telemetry to account for the 412ms weekend latency spike.
# Data source: https://dcmcore.com/data/eurosystem-baseline.json
```

## 4. Medium / Substack Footer Attribution (Markdown)

```markdown
*Data notes: The latency metrics and liquidity gap observations referenced in this article are extracted from the [Eurosystem Baseline JSON](https://dcmcore.com/data/eurosystem-baseline.json) (Q1 2026).*
```

## 5. LaTeX / BibTeX Academic Citation

```bibtex
@dataset{eurosystem_baseline_2026,
  author       = {DCM Core Data Desk},
  title        = {Eurosystem Empirical Baseline Dataset: TARGET2 and SCT Inst Telemetry},
  year         = {2026},
  url          = {https://dcmcore.com/data/eurosystem-baseline.json},
  note         = {Version 2026.Q1-v1.0}
}
```
