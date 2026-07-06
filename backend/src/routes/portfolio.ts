import { Router } from "express";
import {
  getAllPlantIds,
  getRowsForPlant,
  getInverterIdsForPlant,
  getRowsForInverter,
} from "../db";
import {
  filterDateRange,
  qualifyingRows,
  calcPR,
  isAlert,
  sumKw,
} from "../lib/perf";

export const portfolioRouter = Router();

portfolioRouter.get("/portfolio", (req, res) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const threshold = req.query.threshold
      ? parseFloat(req.query.threshold as string)
      : 0.85;

    const plants = getAllPlantIds().map((plantId) => {
      const plantRows = filterDateRange(getRowsForPlant(plantId), from, to);
      const qualifying = qualifyingRows(plantRows);
      const pr = calcPR(qualifying);
      const hasFault = plantRows.some((r) => r.status === "FAULT");

      let alertCount = 0;
      for (const invId of getInverterIdsForPlant(plantId)) {
        const invRows = filterDateRange(getRowsForInverter(invId), from, to);
        const invPr = calcPR(qualifyingRows(invRows));
        if (isAlert(invPr, threshold)) alertCount++;
      }

      return {
        plantId,
        actualKwh: sumKw(qualifying, "acPowerKw"),
        expectedKwh: sumKw(qualifying, "expectedPowerKw"),
        performanceRatio: pr,
        alertCount,
        hasFault,
      };
    });

    const totalActualKwh = plants.reduce((s, p) => s + p.actualKwh, 0);
    const totalExpectedKwh = plants.reduce((s, p) => s + p.expectedKwh, 0);

    res.json({
      dateRange: { from: from ?? null, to: to ?? null },
      totalActualKwh,
      totalExpectedKwh,
      portfolioPerformanceRatio:
        totalExpectedKwh > 0 ? totalActualKwh / totalExpectedKwh : null,
      alertingInverterCount: plants.reduce((s, p) => s + p.alertCount, 0),
      plants,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute portfolio overview" });
  }
});
