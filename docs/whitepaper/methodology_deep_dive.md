# Whitepaper: DCM Digital Scoring Methodology v2.0

## 1. Executive Summary
This document details the mathematical framework used by DCM Digital to evaluate the maturity and risk of tokenized financial assets. Our model, the **DCM Decision Maturity Score**, aggregates heterogeneous data sources into a normalized index (0-100).

## 2. Mathematical Framework

### 2.1 The Global Formula
The score is a weighted linear combination of four primary vectors:
`Score_DCM = (w_T * T) + (w_J * J) + (w_M * M) + (w_E * E)`

| Vector | Weight (w) | Focus Area |
| :--- | :--- | :--- |
| **Technique (T)** | 0.30 | Code integrity, protocol decentralization |
| **Juridique (J)** | 0.30 | MiCA compliance, legal wrappers |
| **Marché (M)** | 0.20 | Liquidity depth, Peg stability |
| **ESG (E)** | 0.20 | Environmental impact, Governance transparency |

### 2.2 Data Normalization
To avoid skewness from high-variance metrics (like volume), we apply **Min-Max Scaling**:
`x_norm = (x - x_min) / (x_max - x_min)`

## 3. Pillar Deep-Dive

### 3.1 Technical Vector (T)
- **Source**: Static analysis of smart contracts & RPC node telemetry.
- **Indicators**: Number of successful audits, TVL/mcap ratio, multisig threshold.

### 3.2 Legal Vector (J)
- **Source**: Regulatory database & legal opinion mapping.
- **Indicators**: Jurisdictional risk (Basle index), KYC integration level, asset class classification.

## 4. Limitations & Edge Cases
- **Systemic Black Swans**: The model cannot predict unprecedented regulatory bans.
- **Correlation Risk**: During extreme market stress, market liquidity (M) and technical stability (T) often show non-linear correlation.

## 5. Bibliography
- European Union (2023). *Markets in Crypto-Assets (MiCA) Regulation*.
- Financial Action Task Force (FATF). *Virtual Assets Red Flag Indicators*.
- Buterin, V. (2022). *The Merge - Security & Economic Implications*.
