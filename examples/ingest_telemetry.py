#!/usr/bin/env python3
"""
ingest_telemetry.py
Reference client demonstrating programmatic ingestion & schema validation under MVDC v1.0.
"""

import os
import json
from datetime import datetime

class DCMCoreClient:
    def __init__(self):
        # Dynamically locate the repository root relative to this script
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.metadata = self._load_json("api/v1/metadata.json")
        self._validate_metadata()

    def _load_json(self, relative_path):
        full_path = os.path.join(self.base_dir, relative_path)
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"Endpoint file not found: {full_path}")
        with open(full_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _validate_metadata(self):
        assert self.metadata.get("api_version") == "1.0.0", "api_version mismatch"
        assert self.metadata.get("schema_version") == "v1.0.0", "schema_version mismatch"
        assert self.metadata.get("license") == "ODbL-1.0", "license mismatch"

    def fetch_dataset(self, endpoint_key):
        endpoints = self.metadata.get("data", {}).get("endpoints", {})
        if endpoint_key not in endpoints:
            raise KeyError(f"Endpoint '{endpoint_key}' not found in metadata catalog.")

        path = endpoints[endpoint_key]["path"]
        if path.startswith("/"):
            path = path[1:]

        payload = self._load_json(path)
        self._validate_contract(payload, endpoint_key)
        return payload

    def _validate_contract(self, payload, key):
        assert payload.get("api_version") == "1.0.0", f"[{key}] Invalid api_version"
        assert payload.get("schema_version") == "v1.0.0", f"[{key}] Invalid schema_version"
        assert "data" in payload, f"[{key}] Missing 'data' array"
        
        data_block = payload["data"]
        assert isinstance(data_block, list), f"[{key}] Data block must be a flat array"

        valid_confidences = {"observed", "estimated", "derived"}
        for idx, obs in enumerate(data_block):
            # Assert schema completeness
            assert set(obs.keys()) == {"timestamp", "metric", "value", "unit", "confidence"}, \
                f"[{key}][obs {idx}] Observation must match MVDC 5-field model strictly"

            assert isinstance(obs["metric"], str), f"[{key}][obs {idx}] Metric must be a string"
            assert isinstance(obs["unit"], str), f"[{key}][obs {idx}] Unit must be a string"
            assert obs["confidence"] in valid_confidences, f"[{key}][obs {idx}] Invalid confidence value"

            # Value validation
            val = obs["value"]
            if val is not None:
                assert isinstance(val, (int, float)), f"[{key}][obs {idx}] Value must be numeric or null"

            # ISO-8601 UTC timestamp check
            ts_str = obs["timestamp"]
            assert ts_str.endswith("Z"), f"[{key}][obs {idx}] Timestamp must end with Z"
            try:
                datetime.fromisoformat(ts_str.replace("Z", ""))
            except ValueError:
                raise AssertionError(f"[{key}][obs {idx}] Invalid timestamp: {ts_str}")

        print(f"✓ Dataset '{key}' successfully validated against MVDC v1.0. Observations parsed: {len(data_block)}")

if __name__ == "__main__":
    print("Initializing DCM Core Reference Ingestion In examples/...")
    client = DCMCoreClient()
    rt1 = client.fetch_dataset("rt1_latency")
    t2 = client.fetch_dataset("target2_settlement")
    lcr = client.fetch_dataset("lcr_velocity")
    print("\nAll endpoints conform strictly to the v1.0 dataset contract.")
