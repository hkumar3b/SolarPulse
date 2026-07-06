import { Router } from "express";
import {
  getRowsForPlant,
  getInverterIdsForPlant,
  getRowsForInverter,
} from "../db";
import { filterDateRange, qualifyingRows, calcPR, isAlert } from "../lib/perf";

export const plantRouter = Router();

plantRouter.get("/plants/:plantId", (req, res) => {
  try {
    const { plantId } = req.params;
    const { from, to } = req.query as { from?: string; to?: string };
    const threshold = req.query.threshold
      ? parseFloat(req.query.threshold as string)
      : 0.85;

    const plantRows = filterDateRange(getRowsForPlant(plantId), from, to);
    if (plantRows.length === 0) {
      return res
        .status(404)
        .json({ error: `No data found for plant ${plantId}` });
    }

    const inverterIds = getInverterIdsForPlant(plantId);

    const inverters = inverterIds.map((inverterId) => {
      const rows = filterDateRange(getRowsForInverter(inverterId), from, to);
      const qualifying = qualifyingRows(rows);
      const pr = calcPR(qualifying);

      const statusBreakdown = { OK: 0, FAULT: 0, OFFLINE: 0 };
      for (const r of rows) statusBreakdown[r.status]++;

      // Full date-filtered rows (not just daylight) so the chart shows the whole day shape,
      // including the night dip to zero — a flat line at night is expected, not a gap.
      const timeSeries = rows
        .map((r) => ({
          timestamp: r.timestamp,
          actualKw: r.acPowerKw,
          expectedKw: r.expectedPowerKw,
          irradiance: r.irradianceWm2,
          status: r.status,
        }))
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

      return {
        inverterId,
        performanceRatio: pr,
        isAlert: isAlert(pr, threshold),
        status: pr === null ? "INSUFFICIENT_DATA" : "OK",
        totalActualKwh: qualifying.reduce((s, r) => s + r.acPowerKw, 0),
        totalExpectedKwh: qualifying.reduce((s, r) => s + r.expectedPowerKw, 0),
        statusBreakdown,
        timeSeries,
      };
    });

    res.json({ plantId, inverters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute plant detail" });
  }
});
