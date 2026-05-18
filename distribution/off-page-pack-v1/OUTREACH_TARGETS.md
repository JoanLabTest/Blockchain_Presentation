# Outreach Targets — GitHub Repositories

**Criteria:** Active repos (committed within 6 months), focused on DLT settlement, SEPA, tokenized finance, or quantitative payments research. Minimum 50 stars preferred for authority transfer.

---

## Priority 1 — Direct Relevance (TARGET2 / Settlement)

### T-01 — `awesome-cbdc`
- **URL:** Search: `github.com/awesome-cbdc` or equivalent curated list
- **Profile:** Curated list of CBDC resources. Contributors regularly add datasets and references.
- **Vector:** Open a new Issue or submit a PR adding our JSON dataset under a "Settlement Data" section.
- **Snippet to use:** Snippet #1 (GitHub/README Markdown)
- **Risk level:** Low — it's a community list, external data is welcome.

### T-02 — Repos tagged `target2`, `sepa-instant`, `settlement`
- **Search query:** `github.com/search?q=target2+sepa+settlement&type=repositories`
- **Profile:** Technical simulation or monitoring tools for European payment rails.
- **Vector:** Find open Issues discussing "latency" or "weekend friction". Reply with the data observation + link.
- **Snippet to use:** Snippet #3 (Inline Python comment) or Snippet #1
- **Risk level:** Low — technical answer to technical question.

---

## Priority 2 — Adjacent Relevance (DLT / Tokenized Assets)

### T-03 — `awesome-tokenization`
- **Search query:** `github.com/search?q=awesome+tokenization+RWA&type=repositories`
- **Profile:** Curated lists for Real World Asset (RWA) tokenization protocols.
- **Vector:** PR to add our baseline dataset under a "Settlement & Liquidity Data" section.
- **Snippet to use:** Snippet #1 (GitHub/README Markdown)
- **Risk level:** Low.

### T-04 — Open DvP / atomic-settlement simulation repos
- **Search query:** `github.com/search?q=DvP+atomic+settlement+simulation&type=repositories`
- **Profile:** Research codebases building Delivery-vs-Payment simulations for tokenized bonds.
- **Vector:** Find a Discussion or Issue about "latency parameters". Reply with our observed 412ms weekend spike as a real-world calibration baseline.
- **Snippet to use:** Snippet #3 (Python comment) + link to JSON dataset.
- **Risk level:** Medium — requires reading the project context to ensure the reply is genuinely useful.

### T-05 — EBA Clearing / RT1 monitoring tools
- **Search query:** `github.com/search?q=EBA+RT1+latency+monitoring&type=repositories`
- **Profile:** Any open-source monitoring, alerting, or benchmarking tool for EBA Clearing's RT1 system.
- **Vector:** Open an Issue proposing to add our observed baseline (412ms peak, 15ms weekday) as a reference benchmark in their documentation.
- **Snippet to use:** Snippet #1 or Snippet #3.
- **Risk level:** Low — adding a real benchmark is a genuine contribution.

---

## Priority 3 — Academic / Research Adjacent

### T-06 — SSRN Working Papers citing ECB / EBA data
- **Platform:** SSRN.com (not GitHub but same seeding logic)
- **Profile:** Working papers on SEPA Instant adoption, European liquidity management, or tokenized bonds.
- **Vector:** In the comments section of relevant papers, mention our dataset as a supplementary source.
- **Snippet to use:** Snippet #2 (SSRN Abstract Plain Text)
- **Risk level:** Low — SSRN comments are designed for academic exchange.

### T-07 — `fintech-research` or `payments-research` repos/wikis
- **Search query:** `github.com/search?q=fintech+payments+research+europe&type=repositories`
- **Profile:** Knowledge-base repositories aggregating fintech/payments research.
- **Vector:** PR to add link to our Desk Note (target2-weekend-liquidity) under a "Settlement Observations" section.
- **Snippet to use:** Snippet #4 (Medium/Substack Footer Attribution)
- **Risk level:** Low.

---

## Priority 4 — Developer Community (Indirect)

### T-08 — MiCA implementation repos / compliance tools
- **Search query:** `github.com/search?q=MiCA+compliance+stablecoin&type=repositories`
- **Profile:** Open-source compliance tools being built for MiCA-regulated stablecoins.
- **Vector:** Find Issues discussing "settlement risk" or "liquidity". Point out that the 0.14 bps TARGET2 gap is a real baseline for stress testing their reserve models.
- **Snippet to use:** Snippet #1
- **Risk level:** Medium — only relevant if the project explicitly mentions settlement mechanics.

### T-09 — Canton Network / Daml finance repos
- **Search query:** `github.com/search?q=canton+daml+tokenized+bond&type=repositories`
- **Profile:** Developers building on Canton Network or Daml for tokenized bond workflows.
- **Vector:** In Discussion threads about settlement timing, share the weekend latency observation as a real-world constraint for their DvP testing.
- **Snippet to use:** Snippet #3 (Python comment style adapted to Daml/Scala context)
- **Risk level:** Low — highly technical, genuinely relevant.

---

## DO NOT CONTACT

❌ Any repo that hasn't been active for 6+ months  
❌ Any repo that is clearly a student project / proof-of-concept  
❌ Any forum that has explicit rules against external dataset promotion  
❌ Any contact where our data is not genuinely relevant to the discussion  
