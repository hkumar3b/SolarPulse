# NOTES.md — SolarPulse Prototype

**Start time:** [06-July-2026 1:19 PM]
**Stop time:** [06-July-2026 1:19 PM]

## 1. Assumptions & Trade-offs:

- **Data store: in-memory.** The CSV (~2,368 rows, 3 plants, 10 inverters) is parsed once on server boot into a flat array plus a couple of lookup maps (by plant, by inverter). This is a deliberate choice for a 3-hour prototype — a real system would use Postgres but that adds setup friction (connection strings, migrations, seeding) that isn't worth the time box here. Trade-off: nothing persists across restarts, and this would not scale to a real multi-plant portfolio with years of history.

- **Daylight filter for PR: `irradiance_w_m2 > 50`.** Rows below this threshold (night, dawn/dusk) are excluded entirely from Performance Ratio math, rather than counted as 0% or ignored some other way. Threshold picked at 50 rather than a lower value like 10 to avoid noisy PR swings during the low-light ramp-up/down hours where small absolute power differences produce large relative swings but i also added the option that user can adjust the PR.

- **OFFLINE rows excluded from PR.** An inverter that's known to be down shouldn't have its "down time" counted against its performance ratio — that's a different, more obvious problem than a silent underperformer that's still reporting OK.

- **FAULT rows included in PR, but also flagged separately.** Only 3 FAULT rows exist in the whole dataset. They're kept in the PR calculation (they represent real generation shortfall), and additionally surfaced as an explicit `⚠ FAULT` badge in the UI at both the inverter and plant level, since a known fault event is a different failure mode than a below-threshold performance ratio.

- **Gaps are skipped, not interpolated.** A few hourly readings are missing per inverter (2-5 out of 240 expected timestamps). Interpolating would add complexity without clear benefit for a portfolio-overview prototype; the chart simply shows a break in the line where a gap exists.

**Minimum sample guard.** An inverter's PR is only computed (and can only trigger an alert) if it has at least 10 qualifying daylight readings in the selected date range. Below that, it returns `null` / `INSUFFICIENT_DATA` rather than a misleading ratio from a tiny sample.

## 2. The Underperformance Rule

**An inverter is flagged as underperforming if its Performance Ratio — Σ(actual kW) ÷ Σ(expected kW), computed over daylight hours (`irradiance_w_m2 > 50`) excluding OFFLINE readings — falls below 0.85 for the selected date range, and only if there are at least 10 qualifying daylight readings in that range.**

**Why 0.85:** Across this portfolio, 9 of 10 inverters cluster tightly at PR 0.97–0.98 under normal operation. One inverter (`PLANT_A_INV_03`) sits at 0.54 — roughly half its expected output — while still reporting status `OK`, which is exactly the "silent underperformance" scenario described in the brief. A threshold of 0.85 sits comfortably below the healthy cluster (so normal day-to-day variance, soiling, or temperature effects won't trip it) but well above the real fault (so it's not a borderline call).

**What would cause false alarms:**

- **A short date range landing on a genuinely cloudy or hazy period** for just one inverter's string — irradiance sensors and actual output don't always track perfectly in patchy cloud, so PR could dip temporarily without anything being broken.
- **Active curtailment** — if a grid operator throttles an inverter's output intentionally, it would look identical to underperformance in this data, but isn't a fault. This isn't detectable from the CSV alone; a production system would need a curtailment-event feed to rule this out.
- **Real soiling or shading** on one string — arguably this _should_ raise a flag since it's a legitimate maintenance issue, but it's worth noting it's a "soft" cause distinct from an equipment fault, and would need a technician to distinguish on-site.

## 3. Customer Answer — "How do I know I can trust this number?"

"The Performance Ratio you're seeing only counts hours when the sun was actually up — anything before sunrise, after sunset, or during very low light gets excluded, so a dark night doesn't drag the number down artificially. It also skips any inverter that's fully offline, since that's a separate, more obvious problem we flag on its own. If an inverter doesn't have enough daylight readings in the time window you've picked, we show it as 'insufficient data' rather than guessing — we'd rather tell you we don't know than show you a number we can't stand behind. The one thing to watch for: a sudden cloudy patch over just one part of your site could dip a single inverter's ratio temporarily without anything actually being broken, so if you see a borderline flag, it's worth a quick look at the chart before dispatching a truck."

**All 10 inverters (including the broken one):**

Mean PR: 0.933
Median PR: 0.978
Std dev: 0.139 (huge — because one point is wildly off from the rest)

**Excluding INV_03 (the 9 healthy inverters):**

Mean PR: 0.977
Std dev: 0.0036 — extremely tight. The healthy population barely varies at all (0.969 to 0.980, a spread of just over 1 percentage point).
