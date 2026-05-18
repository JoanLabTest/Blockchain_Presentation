#!/usr/bin/env python3
"""
pandas_client.py
Downstream Ingestion Pattern Client: Multi-dataset Pandas Time-Series Alignment.
Designed for non-ambiguous, downstream quantitative workflows. Zero narrative bias.
"""

import os
import json
import pandas as pd

def align_telemetry():
    # Dynamically locate the repository base path
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print("Loading standard flat datasets from repo base...")
    
    with open(os.path.join(base_dir, "api/v1/rt1-latency.json"), "r") as f:
        rt1_payload = json.load(f)
    with open(os.path.join(base_dir, "api/v1/target2-settlement.json"), "r") as f:
        t2_payload = json.load(f)

    # Convert flat arrays directly into DataFrames (No structural transformations needed)
    df_rt1 = pd.DataFrame(rt1_payload["data"])
    df_t2 = pd.DataFrame(t2_payload["data"])

    # Parse timestamps
    df_rt1["timestamp"] = pd.to_datetime(df_rt1["timestamp"])
    df_t2["timestamp"] = pd.to_datetime(df_t2["timestamp"])

    # Pivot Tables (Standard quantitative formatting)
    df_rt1_pivoted = df_rt1[df_rt1["metric"].str.startswith("rt1_")].pivot(
        index="timestamp", 
        columns="metric", 
        values="value"
    )

    df_t2_pivoted = df_t2[df_t2["metric"] == "t2_weekend_liquidity_premium_bps"].pivot(
        index="timestamp", 
        columns="metric", 
        values="value"
    )

    print("\n--- RT1 TELEMETRY MATRIX ---")
    print(df_rt1_pivoted)

    print("\n--- TARGET2 WEEKEND LIQUIDITY PREMIUMS ---")
    print(df_t2_pivoted)

    # Temporal Ingestion Join (Asof Merge with nearest backfill)
    df_aligned = pd.merge_asof(
        df_rt1_pivoted.sort_index(), 
        df_t2_pivoted.sort_index(), 
        left_index=True, 
        right_index=True,
        direction="nearest"
    )

    print("\n--- DOWNSTREAM TEMPORAL ALIGNMENT MATRIX ---")
    print(df_aligned)

if __name__ == "__main__":
    align_telemetry()
