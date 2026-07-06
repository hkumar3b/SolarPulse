import { useEffect, useState } from "react";
import { fetchPortfolio, fetchPlantDetail } from "../api/client";
import type { PortfolioResponse, PlantDetailResponse } from "../types/api";
import { KPICards } from "../components/KPICards.tsx";
import { PlantTable } from "../components/PlantTable.tsx";
import { PowerChart } from "../components/PowerChart.tsx";

export function Dashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [plantDetail, setPlantDetail] = useState<PlantDetailResponse | null>(
    null,
  );
  const [selectedInverterId, setSelectedInverterId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load portfolio once on mount
  useEffect(() => {
    fetchPortfolio()
      .then((data) => {
        setPortfolio(data);
        // auto-select the worst-performing plant so the operator sees the problem immediately
        if (data.plants.length > 0) {
          const worst = [...data.plants].sort(
            (a, b) => (a.performanceRatio ?? 1) - (b.performanceRatio ?? 1),
          )[0];
          setSelectedPlantId(worst.plantId);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Load plant detail whenever selected plant changes
  useEffect(() => {
    if (!selectedPlantId) return;
    fetchPlantDetail(selectedPlantId)
      .then((data) => {
        setPlantDetail(data);
        const worstInv = [...data.inverters].sort(
          (a, b) => (a.performanceRatio ?? 1) - (b.performanceRatio ?? 1),
        )[0];
        setSelectedInverterId(worstInv?.inverterId ?? null);
      })
      .catch((err) => setError(err.message));
  }, [selectedPlantId]);

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!portfolio) return null;

  const selectedInverter = plantDetail?.inverters.find(
    (i) => i.inverterId === selectedInverterId,
  );

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>🌞 SolarPulse Control Room</h1>

      <KPICards portfolio={portfolio} />

      <PlantTable
        portfolio={portfolio}
        selectedPlantId={selectedPlantId}
        onSelectPlant={setSelectedPlantId}
      />

      {plantDetail && (
        <div style={{ marginTop: "24px" }}>
          <h3>{plantDetail.plantId} — Inverter Detail</h3>
          <select
            value={selectedInverterId ?? ""}
            onChange={(e) => setSelectedInverterId(e.target.value)}
          >
            {plantDetail.inverters.map((inv) => (
              <option key={inv.inverterId} value={inv.inverterId}>
                {inv.inverterId} {inv.isAlert ? "🔴" : "✅"} PR:{" "}
                {inv.performanceRatio?.toFixed(2) ?? "N/A"}
              </option>
            ))}
          </select>

          {selectedInverter && <PowerChart inverter={selectedInverter} />}
        </div>
      )}
    </div>
  );
}
