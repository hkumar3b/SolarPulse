import { Router } from "express";
import {
  getAllPlantIds,
  getInverterIdsForPlant,
  getRowsForInverter,
} from "../db";
import { filterDateRange, qualifyingRows, calcPR, isAlert } from "../lib/perf";

export const alertsRouter = Router();

alertsRouter.get("/alerts", (req, res) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const threshold = req.query.threshold
      ? parseFloat(req.query.threshold as string)
      : 0.85;

    const alerts: {
      inverterId: string;
      plantId: string;
      performanceRatio: number;
      severity: "CRITICAL" | "WARNING";
    }[] = [];

    for (const plantId of getAllPlantIds()) {
      for (const inverterId of getInverterIdsForPlant(plantId)) {
        const rows = filterDateRange(getRowsForInverter(inverterId), from, to);
        const pr = calcPR(qualifyingRows(rows));

        if (isAlert(pr, threshold)) {
          alerts.push({
            inverterId,
            plantId,
            performanceRatio: pr as number,
            severity: (pr as number) < threshold * 0.7 ? "CRITICAL" : "WARNING",
          });
        }
      }
    }

    alerts.sort((a, b) => a.performanceRatio - b.performanceRatio);
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute alerts" });
  }
});
