# DCM Digital Intelligence - API Specification v1.0

## Base URL
`https://api.dcm-digital.com/v1`

## Authentication
All endpoints require a Bearer Token (JWT) from Supabase Auth.
Header: `Authorization: Bearer <token>`

---

## 1. User Intelligence (`/user`)

### GET `/user/stats`
Retrieves the aggregated dashboard statistics for the current user.

**Response:**
```json
{
  "user_id": "uuid",
  "maturity_score": 78,
  "score_breakdown": {
    "legal": 85,
    "tech": 60,
    "risk": 90,
    "engagement": 75
  },
  "coverage_percent": 45,
  "quiz_average": 82,
  "last_active": "2026-02-19T14:30:00Z"
}
```

### GET `/user/evolution`
Retrieves historical score data for the "Evolution Chart".

**Query Params:** `?range=30d` (default), `90d`, `1y`

**Response:**
```json
[
  { "date": "2026-02-01", "score": 65 },
  { "date": "2026-02-08", "score": 68 },
  { "date": "2026-02-15", "score": 72 }
]
```

---

## 2. Simulations (`/simulations`)

### GET `/simulations/history`
Retrieves a list of past simulations.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "High Yield Staking ETH",
    "type": "staking",
    "date": "2026-02-18",
    "result_apy": "5.4%",
    "risk_level": "Medium"
  }
]
```

### POST `/simulations/save`
Saves a new simulation run.

**Body:**
```json
{
  "name": "My Custom Scenario",
  "type": "lending",
  "parameters": { "collateral": 1000, "ltv": 75 },
  "results": { "liquidation_price": 1800, "opy": 8.5 }
}
```

---

## 3. Compliance (`/compliance`)

### GET `/compliance/profile`
Calculates the dynamic "Regulatory Impact Score" based on user profile.

**Response:**
```json
{
  "jurisdiction": "EU",
  "impact_score": 45, // 0-100 (High score = High Friction)
  "required_actions": [
    "Verify MiCA CASP license",
    "Check T+1 Settlement impact"
  ],
  "status": "compliant"
}
```
