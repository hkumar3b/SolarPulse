import type { PortfolioResponse } from "../types/api";

export function KPICards({ portfolio }: { portfolio: PortfolioResponse }) {
  const cardStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    flex: 1,
    textAlign: "center",
  };

  const pr = portfolio.portfolioPerformanceRatio;
  const prColor = pr === null ? "#999" : pr < 0.85 ? "#d32f2f" : "#2e7d32";

  return (
    <div style={{ display: "flex", gap: "16px", margin: "16px 0" }}>
      <div style={cardStyle}>
        <div style={{ fontSize: "13px", color: "#666" }}>Total Generation</div>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          {(portfolio.totalActualKwh / 1000).toFixed(2)} MWh
        </div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: "13px", color: "#666" }}>Portfolio PR</div>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: prColor }}>
          {pr !== null ? `${(pr * 100).toFixed(1)}%` : "N/A"}
        </div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: "13px", color: "#666" }}>
          🔴 Alerting Inverters
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: portfolio.alertingInverterCount > 0 ? "#d32f2f" : "#2e7d32",
          }}
        >
          {portfolio.alertingInverterCount}
        </div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: "13px", color: "#666" }}>Active Plants</div>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          {portfolio.plants.length}
        </div>
      </div>
    </div>
  );
}
