# MVDC v1.0 — Minimum Viable Dataset Contract

## Overview

This repository defines a versioned, machine-readable data contract for structured financial telemetry.

The system provides a set of static, versioned datasets exposed under `/api/v1/` following a strict, non-ambiguous schema designed for direct ingestion into analytical pipelines.

All datasets conform to the MVDC v1.0 specification.

---

## Data Contract

Each dataset follows a unified envelope:

```json
{
  "api_version": "1.0.0",
  "dataset": "string",
  "last_updated": "ISO-8601 UTC timestamp",
  "license": "ODbL-1.0",
  "source": "DCM Core Telemetry",
  "schema_version": "v1.0.0",
  "data": []
}
```

### Observation Schema

Each element of `data[]` is a flat observation record:

```json
{
  "timestamp": "ISO-8601 UTC timestamp",
  "metric": "snake_case_identifier",
  "value": "number | null",
  "unit": "string",
  "confidence": "observed | estimated | derived"
}
```

No nested structures are permitted.

No additional fields are allowed.

---

## Versioning

* `api_version` is immutable within a major version.
* Breaking changes require a major version increment.
* All datasets under `/api/v1/` conform to `v1.0.0`.

---

## Null & Missing Data Handling

* Missing or unobserved values are explicitly represented as `null`.
* Gaps are treated as first-class observations.
* No implicit interpolation is performed at dataset level.

---

## License

All datasets are distributed under:

**Open Database License (ODbL) 1.0**

See: [https://opendatacommons.org/licenses/odbl/](https://opendatacommons.org/licenses/odbl/)

---

## Endpoints

All datasets are exposed as static JSON endpoints:

* `/api/v1/rt1-latency.json`
* `/api/v1/target2-settlement.json`
* `/api/v1/lcr-velocity.json`
* `/api/v1/tfin-schema.json`
* `/api/v1/metadata.json`

---

## Intended Usage

This repository is designed for:

* quantitative research pipelines
* ETL ingestion systems
* risk modeling environments
* time-series analysis frameworks
* machine-readable data integration

Direct ingestion is supported without transformation layers.

Example:

```python
import requests
import pandas as pd

url = "https://<domain>/api/v1/rt1-latency.json"
data = requests.get(url).json()

df = pd.DataFrame(data["data"])
```

---

## Validation

Dataset integrity is enforced via:

* `tests/contract_test.py`
* strict schema validation
* immutable field contracts
* deterministic structure checks

Any deviation from the MVDC schema results in test failure.

---

## Design Principle

The system is designed to eliminate interpretative ambiguity at the data layer.

All interpretation is delegated downstream.
