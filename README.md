# SolarPulse — Plant Monitoring Prototype

A control-room dashboard for Aurora Renewables that ingests hourly inverter telemetry and surfaces which plants/inverters need attention today.

## Stack

- **Backend:** Node.js + Express + TypeScript, in-memory data store (CSV loaded on boot)
- **Frontend:** React + Vite + TypeScript, Recharts for time-series charting

## Prerequisites

- Node.js (v18 or later recommended)
- npm

No database setup required — telemetry data is loaded from `telemetry.csv` into memory when the backend starts.

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
npm run start
```

The API starts on **http://localhost:3001**. You should see a console log confirming how many telemetry rows were loaded (and how many were skipped, if any were malformed).

> Make sure `telemetry.csv` is present at the path referenced in `backend/src/index.ts` (one level above `backend/`, i.e. at the project root) — adjust the path there if you've placed it elsewhere.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The dashboard starts on **http://localhost:5173**. Open it in your browser.

### 3. Login

[FILL IN — describe how auth works, e.g.:]
The dashboard is protected by a simple hardcoded-credential login.

- **mail:** `admin@gmail.com`
- **Password:** `admin1`

> Note: this is a basic in-memory auth check added beyond the assignment's required scope, mainly to demonstrate the pattern. It is not production-grade — no password hashing, session persistence, or role-based access control.

## API Endpoints

| Endpoint                                        | Description                                              |
| ----------------------------------------------- | -------------------------------------------------------- |
| `GET /api/portfolio?from=&to=&threshold=`       | Per-plant totals, portfolio-level PR, and alert count    |
| `GET /api/plants/:plantId?from=&to=&threshold=` | Per-inverter breakdown + hourly time series for charting |
| `GET /api/alerts?from=&to=&threshold=`          | Flat list of alerting inverters, sorted by PR ascending  |

All three accept an optional `threshold` query param (default `0.85`) — the frontend's threshold slider uses this to live-update alerts without a page reload.

## Project Structure

```
SolarPulse/
├── backend/
│   └── src/
│       ├── index.ts        # Server entry point
│       ├── db.ts           # CSV loading & in-memory store
│       ├── types.ts        # Shared TelemetryRow type
│       ├── lib/
│       │   └── perf.ts     # Performance ratio logic (pure, testable)
│       ├── middleware/
│       │   └── auth.ts     # Auth token middleware
│       └── routes/
│           ├── alerts.ts
│           ├── auth.ts     # Login & registration routes
│           ├── plant.ts
│           └── portfolio.ts
├── frontend/
│   └── src/
│       ├── api/client.ts       # Typed fetch helpers
│       ├── types/api.ts        # Shared response types
│       ├── context/
│       │   └── AuthContext.tsx # Context for tracking authentication state
│       ├── components/
│       │   ├── KPICards.tsx
│       │   ├── PlantTable.tsx
│       │   ├── PowerChart.tsx
│       │   └── ThresholdSlider.tsx
│       └── pages/
│           ├── AuthPage.tsx    # Login & registration interface
│           └── Dashboard.tsx
├── telemetry.csv
├── NOTES.md
└── README.md
```

## Known Limitations

See `NOTES.md` for the full write-up on assumptions, the underperformance rule, and trade-offs. Briefly:

- In-memory storage — data resets if the backend restarts.
- No visual distinction yet between full-day OFFLINE outages and genuine low-irradiance dips on the chart.
- Basic auth is hardcoded credentials, not intended for production use.
