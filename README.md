# 🧠 Digital Assets Research OS & Presentation Platform

> **Status** : 🏛️ Institutional Grade Audit Passed (Phase 11)  
> **Version** : Search 4.0 "Deep Tech"  
> **Deployment** : [Live Demo](https://joanlabtest.github.io/Blockchain_Presentation/)

---

## 🎯 Executive Summary
This project is an advanced **Structured Knowledge System** designed for Digital Assets research. 
It transcends standard educational sites by implementing a **Research Intelligence Layer** (Search 4.0) that mimics institutional terminals (Bloomberg/Refinitiv) using a 100% static, zero-backend architecture.

---

## 🧬 Core Tech: The "Research Engine" (Search 4.0)
The platform is powered by a proprietary Python-based indexing engine that transforms static HTML into a navigable Knowledge Graph.

### 1. Quantitative Scoring (TF-IDF)
*   **Algorithm**: Term Frequency-Inverse Document Frequency.
*   **Function**: Mathematically calculates the "information density" of each section.
*   **Impact**: Rare, technical terms (*"Validator", "Slashing"*) automatically outweigh generic terms (*"Blockchain", "Token"*), ensuring expert-level relevance without manual curation.

### 2. Knowledge Graph ($O(N^2)$ Auto-Linking)
*   **Architecture**: The build script analyzes semantic intersections between all 58+ nodes.
*   **Logic**: `If (SharedTags > 2) OR (TitleIntersection > 1) -> CreateBidirectionalLink()`.
*   **UX**: Results display **"Voir aussi"** (See Also) connections, enabling lateral navigation through the concept graph.

### 3. Bilingual NLP Core
*   **Linguistics**: Native mapping of French/English technical vocabulary.
*   **Scope**: *Risk* ↔ *Risque*, *Yield* ↔ *Rendement*, *Law* ↔ *Loi*.
*   **Result**: A query in French finds English concepts contextually.

### 4. Contextual Intelligence
*   **Local Boost**: The engine detects the user's current reading context (e.g., *PoS Economics*) and boosts related results (+15% score).
*   **Intersection Logic**: Boolean AND logic implies specific queries (e.g., *"Smart Contract Risk"*) filter for intersection, reducing noise.

---

## 🏛️ Architecture & Versions

### 1️⃣ Research Terminal (Pro) - `index.html`
**Target**: Quant Researchers, Fund Managers, Auditors.
*   **Full Research OS**: Search 4.0, Knowledge Graph, Interactive Tools.
*   **Live Data**: CAC 40 Real-time feed, Trading Simulator.
*   **Modules**: 23 Deep-dive sections (Legal, macro, Tech).
*   **Codebase**: ~7,500 lines (Modular).

### 2️⃣ Pitch Deck (Lite) - `index-simple.html`
**Target**: VC Pitch, Executive Summary.
*   **Focus**: 6 Essential Sections (Natixis Focus, Market Overview).
*   **Performance**: <0.5s load time.
*   **Flow**: Linear narrative.

---

## 🛡️ Audit & Reliability
*   **Zero-Backend**: All intelligence is pre-computed (Python) or client-side (JS). No DB failure points.
*   **Automated Indexing**: `generate_index.py` guarantee synchronization between content and search.
*   **Privacy**: No external trackers, full sovereignty.

---

## 🔗 Live Access
*   **Research Terminal**: [Launch App](https://joanlabtest.github.io/Blockchain_Presentation/)
*   **Lite Deck**: [Launch Lite](https://joanlabtest.github.io/Blockchain_Presentation/index-simple.html)

---
*Built by Joan Lab - 2026*
