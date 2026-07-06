import { TelemetryRow } from "../types";

export function filterDateRange(
  rows: TelemetryRow[],
  from?: string,
  to?: string,
): TelemetryRow[] {
  if (!from && !to) return rows;
  return rows.filter((r) => {
    const t = r.timestamp;
    if (from && t < from) return false;
    if (to && t > to) return false;
    return true;
  });
}

export function filterDaylight(
  rows: TelemetryRow[],
  minIrradiance = 50,
): TelemetryRow[] {
  return rows.filter((r) => r.irradianceWm2 > minIrradiance);
}

export function filterOffline(rows: TelemetryRow[]): TelemetryRow[] {
  return rows.filter((r) => r.status !== "OFFLINE");
}

export function qualifyingRows(
  rows: TelemetryRow[],
  minIrradiance = 50,
): TelemetryRow[] {
  return filterOffline(filterDaylight(rows, minIrradiance));
}

export function calcPR(rows: TelemetryRow[], minSamples = 10): number | null {
  if (rows.length < minSamples) return null;
  const actual = rows.reduce((sum, r) => sum + r.acPowerKw, 0);
  const expected = rows.reduce((sum, r) => sum + r.expectedPowerKw, 0);
  if (expected === 0) return null;
  return actual / expected;
}

export function isAlert(pr: number | null, threshold = 0.85): boolean {
  return pr !== null && pr < threshold;
}

export function sumKw(
  rows: TelemetryRow[],
  field: "acPowerKw" | "expectedPowerKw",
): number {
  return rows.reduce((sum, r) => sum + r[field], 0);
}
