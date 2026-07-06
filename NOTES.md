Store: in-memory array, parsed from CSV on server boot. Justified because the dataset is ~2,400 rows and this is a 3-hour prototype — a real system would use Postgres/TimescaleDB, but that's scope I'm deliberately not spending time on.

Daylight filter: rows with irradiance_w_m2 <= 50 are excluded from PR math entirely (not treated as 0% or 100% — just excluded), since night/near-zero-irradiance readings would otherwise drag or inflate the ratio meaninglessly.

OFFLINE rows: excluded from PR calc (no expected generation should count against an inverter that's known to be down — that's a separate, more obvious alert, not a "silent" one).

FAULT rows: I'd keep these in the PR calc (only 3 in the whole dataset) but also surface status=FAULT as its own explicit red flag in the UI, since a fault is a known problem, not a silent one.

Gaps: missing hourly rows are just skipped, not interpolated — interpolating would be over-engineering for this timebox.

Minimum sample guard: don't alert on an inverter with too few daylight readings in the range (e.g., <10), so a single bad partial day doesn't trigger a false alarm.

Irradiance is the amount of radiant power (energy per unit time (P/A)) incident on a specific surface area

An inverter is flagged as underperforming if its Performance Ratio (Σactual ÷ Σexpected, over daylight hours with irradiance > 50 W/m², excluding OFFLINE readings) falls below 0.85 for the selected date range, with at least 10 qualifying daylight readings.
