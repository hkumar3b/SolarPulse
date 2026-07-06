import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { TelemetryRow } from "./types";

let rows: TelemetryRow[] = [];
let byPlant = new Map<string, TelemetryRow[]>();
let byInverter = new Map<string, TelemetryRow[]>();

export function loadTelemetry(csvPath: string) {
  const raw = fs.readFileSync(path.resolve(csvPath), "utf-8");
  const records = parse(raw, { columns: true, skip_empty_lines: true }) as any[];

  let skipped = 0;

  for (const r of records) {
    try {
      const row: TelemetryRow = {
        timestamp: r.timestamp,
        plantId: r.plant_id,
        inverterId: r.inverter_id,
        acPowerKw: parseFloat(r.ac_power_kw),
        expectedPowerKw: parseFloat(r.expected_power_kw),
        irradianceWm2: parseFloat(r.irradiance_w_m2),
        moduleTempC: parseFloat(r.module_temp_c),
        status: r.status,
      };

      // skip rows where core numeric fields didn't parse
      if (Number.isNaN(row.acPowerKw) || Number.isNaN(row.expectedPowerKw)) {
        skipped++;
        continue;
      }

      rows.push(row);

      if (!byPlant.has(row.plantId)) byPlant.set(row.plantId, []);
      byPlant.get(row.plantId)!.push(row);

      if (!byInverter.has(row.inverterId)) byInverter.set(row.inverterId, []);
      byInverter.get(row.inverterId)!.push(row);
    } catch {
      skipped++;
    }
  }

  console.log(`Loaded ${rows.length} rows, skipped ${skipped} malformed rows`);
}

export function getRows(): TelemetryRow[] {
  return rows;
}

export function getRowsForPlant(plantId: string): TelemetryRow[] {
  return byPlant.get(plantId) ?? [];
}

export function getRowsForInverter(inverterId: string): TelemetryRow[] {
  return byInverter.get(inverterId) ?? [];
}

export function getAllPlantIds(): string[] {
  return Array.from(byPlant.keys());
}

export function getInverterIdsForPlant(plantId: string): string[] {
  return Array.from(new Set(getRowsForPlant(plantId).map((r) => r.inverterId)));
}
