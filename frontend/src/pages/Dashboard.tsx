import { useEffect, useState } from "react";
import { fetchPortfolio, fetchPlantDetail } from "../api/client";
import type { PortfolioResponse, PlantDetailResponse } from "../types/api";
import { KPICards } from "../components/KPICards";
import { PlantTable } from "../components/PlantTable";
import { PowerChart } from "../components/PowerChart";
import { ThresholdSlider } from "../components/ThresholdSlider";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [plantDetail, setPlantDetail] = useState<PlantDetailResponse | null>(
    null,
  );
  const [selectedInverterId, setSelectedInverterId] = useState<string | null>(
    null,
  );
  const [threshold, setThreshold] = useState(0.85);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Reload portfolio whenever threshold changes (not just on mount)
  useEffect(() => {
    setLoading(true);
    fetchPortfolio(undefined, undefined, threshold)
      .then((data) => {
        setPortfolio(data);
        const worst = [...data.plants].sort(
          (a, b) => (a.performanceRatio ?? 1) - (b.performanceRatio ?? 1),
        )[0];
        if (worst) setSelectedPlantId(worst.plantId);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [threshold]);

  // Reload plant detail whenever plant OR threshold changes
  useEffect(() => {
    if (!selectedPlantId) return;
    fetchPlantDetail(selectedPlantId, undefined, undefined, threshold)
      .then((data) => {
        setPlantDetail(data);
        const worstInv = [...data.inverters].sort(
          (a, b) => (a.performanceRatio ?? 1) - (b.performanceRatio ?? 1),
        )[0];
        setSelectedInverterId(worstInv?.inverterId ?? null);
      })
      .catch((err) => setError(err.message));
  }, [selectedPlantId, threshold]);

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!portfolio) return null;

  const selectedInverter = plantDetail?.inverters.find(
    (i) => i.inverterId === selectedInverterId,
  );

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🌞 SolarPulse Control Room</h1>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span>Logged in as <strong>{user.email}</strong></span>
            <button onClick={logout}>Log Out</button>
          </div>
        )}
      </div>

      <KPICards portfolio={portfolio} />

      <PlantTable
        portfolio={portfolio}
        selectedPlantId={selectedPlantId}
        onSelectPlant={setSelectedPlantId}
      />
      <ThresholdSlider threshold={threshold} onChange={setThreshold} />

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
