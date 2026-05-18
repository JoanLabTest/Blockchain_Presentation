# Minimum Viable Dataset Contract (MVDC) v1.0
**Authoritative Technical Specification**  
**Version:** 1.0.0  
**License:** ODbL-1.0 (Open Database License)  
**Computational Intent:** The datasets specified herein are designed strictly for machine computation, not narrative interpretation. Any analytical inference, causal attribution, or qualitative synthesis must be performed downstream.

---

## 1. Structural Envelope Spec

Every endpoint serving compliance time-series data under this standard must return a flat, unauthenticated JSON document conforming to the following envelope structure:

```json
{
  "api_version": "1.0.0",
  "dataset": "string",
  "last_updated": "ISO-8601",
  "license": "ODbL-1.0",
  "source": "DCM Core Telemetry",
  "schema_version": "v1.0.0",
  "data": []
}
```

### Mandatory Envelope Fields
*   `api_version` (string): Absolute major version constraint. Must be strictly `"1.0.0"`.
*   `dataset` (string): Snake-case identifier for the dataset (e.g., `"rt1_latency"`).
*   `last_updated` (string): UTC timestamp formatted strictly to ISO-8601.
*   `license` (string): Licensing contract identifier. Must be strictly `"ODbL-1.0"`.
*   `source` (string): Source authority. Must be strictly `"DCM Core Telemetry"`.
*   `schema_version` (string): Absolute minor schema version. Must be strictly `"v1.0.0"`.
*   `data` (array): Flat array containing telemetry observation objects.

---

## 2. Telemetry Observation Object Spec (`data[]`)

Each observation object inside the `data` array must strictly contain the following 5 fields. Custom, unlisted, or nested parameters are structurally prohibited.

```json
{
  "timestamp": "ISO-8601",
  "metric": "string",
  "value": "number | null",
  "unit": "string",
  "confidence": "observed | estimated | derived"
}
```

### Field Definitions & Type Constraints
1.  `timestamp` (string): ISO-8601 UTC timestamp format (`YYYY-MM-DDTHH:MM:SSZ`).
2.  `metric` (string): Unique snake_case metric identifier (e.g., `"rt1_avg_latency_ms"`).
3.  `value` (float | integer | null): Numerical measurement. If telemetry collection failed or experienced maintenance gaps, this field must be explicitly set to `null`. It must never be omitted, and string values are strictly prohibited.
4.  `unit` (string): Measurement unit identifier (e.g., `"ms"`, `"bps"`, `"pct"`, `"ratio"`, `"count"`).
5.  `confidence` (string): Data quality confidence level. Must strictly be one of:
    *   `"observed"`: Direct telemetry observation.
    *   `"estimated"`: Downstream desk interpolation.
    *   `"derived"`: Mathematically computed parameter.

---

## 3. Structural Stability & Immutability Guarantees

To ensure downstream programmatic ingestion pipelines (e.g., Pandas, DuckDB, Apache Arrow, ETLs) remain fully stable, the following invariants are enforced:
1.  **Type Immutability**: Within `schema_version` `"v1.0.0"`, field names, value data types, and enum matrices are immutable.
2.  **Additive Evolution Only**: Non-breaking structural additions (e.g., registering new endpoints or optional descriptors in parent registries) are restricted to minor updates (`v1.1.0`). 
3.  **Explicit Null Policy**: Missing values must be explicitly set to `null` to ensure analytical alignment. Omitting fields is classified as a contract violation.

---

## 4. Reference JSON Mapping Example

The following is a conforming implementation mapping TARGET2 weekend settlement metrics:

```json
{
  "api_version": "1.0.0",
  "dataset": "target2_settlement",
  "last_updated": "2026-05-18T16:00:00Z",
  "license": "ODbL-1.0",
  "source": "DCM Core Telemetry",
  "schema_version": "v1.0.0",
  "data": [
    {
      "timestamp": "2026-05-16T00:00:00Z",
      "metric": "t2_weekend_liquidity_premium_bps",
      "value": 0.12,
      "unit": "bps",
      "confidence": "observed"
    },
    {
      "timestamp": "2026-05-16T02:00:00Z",
      "metric": "t2_weekend_liquidity_premium_bps",
      "value": null,
      "unit": "bps",
      "confidence": "estimated"
    }
  ]
}
```
