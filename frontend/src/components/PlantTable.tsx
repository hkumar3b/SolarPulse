import type { PortfolioResponse } from "../types/api";

interface Props {
  portfolio: PortfolioResponse;
  selectedPlantId: string | null;
  onSelectPlant: (plantId: string) => void;
}

export function PlantTable({
  portfolio,
  selectedPlantId,
  onSelectPlant,
}: Props) {
  const sortedPlants = [...portfolio.plants].sort(
    (a, b) => (a.performanceRatio ?? 1) - (b.performanceRatio ?? 1),
  );

  return (
    <table
      style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}
    >
      <thead>
        <tr style={{ borderBottom: "2px solid #333", textAlign: "left" }}>
          <th style={{ padding: "8px" }}>Plant</th>
          <th style={{ padding: "8px" }}>Actual (kWh)</th>
          <th style={{ padding: "8px" }}>Expected (kWh)</th>
          <th style={{ padding: "8px" }}>PR</th>
          <th style={{ padding: "8px" }}>Alerts</th>
        </tr>
      </thead>
      <tbody>
        {sortedPlants.map((plant) => (
          <tr
            key={plant.plantId}
            onClick={() => onSelectPlant(plant.plantId)}
            style={{
              cursor: "pointer",
              borderBottom: "1px solid #eee",
              backgroundColor:
                plant.plantId === selectedPlantId ? "#f0f7ff" : "transparent",
            }}
          >
            <td style={{ padding: "8px" }}>{plant.plantId}</td>
            <td style={{ padding: "8px" }}>{plant.actualKwh.toFixed(1)}</td>
            <td style={{ padding: "8px" }}>{plant.expectedKwh.toFixed(1)}</td>
            <td style={{ padding: "8px" }}>
              {plant.performanceRatio !== null
                ? `${(plant.performanceRatio * 100).toFixed(1)}%`
                : "N/A"}
            </td>
            <td style={{ padding: "8px" }}>
              {plant.alertCount > 0 ? `🔴 ${plant.alertCount}` : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
