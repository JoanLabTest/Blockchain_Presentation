#!/usr/bin/env python3
"""
contract_test.py
Automated MVDC v1.0 strict verification test suite.
"""

import os
import json
import unittest
from datetime import datetime

class TestDCMCoreMVDCContract(unittest.TestCase):
    def setUp(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.registered_keys = ["rt1_latency", "target2_settlement", "lcr_velocity"]

    def _load_json(self, relative_path):
        full_path = os.path.join(self.base_dir, relative_path)
        self.assertTrue(os.path.exists(full_path), f"Endpoint path does not exist: {full_path}")
        with open(full_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def test_metadata_envelope(self):
        """Verify standard envelope invariants in metadata.json"""
        meta = self._load_json("api/v1/metadata.json")
        
        # Envelope assertions
        self.assertEqual(meta.get("api_version"), "1.0.0", "api_version mismatch")
        self.assertEqual(meta.get("dataset"), "metadata_catalog", "dataset key mismatch")
        self.assertEqual(meta.get("license"), "ODbL-1.0", "license contract mismatch")
        self.assertEqual(meta.get("schema_version"), "v1.0.0", "schema_version mismatch")
        self.assertEqual(meta.get("source"), "DCM Core Telemetry", "source mismatch")
        
        # Type and metadata assertions
        self.assertIn("data", meta)
        data = meta["data"]
        self.assertIn("contracts", data)
        self.assertIn("endpoints", data)

    def test_datasets_conformance(self):
        """Enforce strict MVDC schemas, flat time-series structures, and types across all registered datasets"""
        paths = {
            "rt1_latency": "api/v1/rt1-latency.json",
            "target2_settlement": "api/v1/target2-settlement.json",
            "lcr_velocity": "api/v1/lcr-velocity.json"
        }

        for key, relative_path in paths.items():
            payload = self._load_json(relative_path)
            
            # Standard envelope assertions
            self.assertEqual(payload.get("api_version"), "1.0.0", f"[{key}] Invalid api_version")
            self.assertEqual(payload.get("dataset"), key, f"[{key}] Dataset key mismatch")
            self.assertEqual(payload.get("license"), "ODbL-1.0", f"[{key}] Invalid license contract")
            self.assertEqual(payload.get("schema_version"), "v1.0.0", f"[{key}] Invalid schema_version")
            self.assertEqual(payload.get("source"), "DCM Core Telemetry", f"[{key}] Source mismatch")
            self.assertIn("data", payload, f"[{key}] Missing 'data' observations array")
            
            data_block = payload["data"]
            self.assertIsInstance(data_block, list, f"[{key}] Data block must be a flat array")
            self.assertGreater(len(data_block), 0, f"[{key}] Observations array is empty")

            valid_confidences = {"observed", "estimated", "derived"}

            # Standard observation fields, types, and constraints
            for idx, obs in enumerate(data_block):
                # 1. Structure Verification (Only 5 fields permitted)
                self.assertEqual(set(obs.keys()), {"timestamp", "metric", "value", "unit", "confidence"},
                                 f"[{key}][obs {idx}] Observation does not strictly follow MVDC 5-field schema")
                
                # 2. Strict Type Constraints
                self.assertIsInstance(obs["metric"], str, f"[{key}][obs {idx}] Metric must be a string")
                self.assertIsInstance(obs["unit"], str, f"[{key}][obs {idx}] Unit must be a string")
                self.assertIn(obs["confidence"], valid_confidences, f"[{key}][obs {idx}] Invalid confidence value")

                # Value: numeric or explicit null
                val = obs["value"]
                if val is not None:
                    self.assertIsInstance(val, (int, float), f"[{key}][obs {idx}] Value must be int/float or None")

                # Timestamp ISO-8601 formatting
                ts_str = obs["timestamp"]
                self.assertTrue(ts_str.endswith("Z"), f"[{key}][obs {idx}] Timestamp must be UTC (ending with Z)")
                try:
                    datetime.fromisoformat(ts_str.replace("Z", ""))
                except ValueError:
                    self.fail(f"[{key}][obs {idx}] Invalid ISO-8601 timestamp: {ts_str}")

if __name__ == "__main__":
    unittest.main()
