import type { AlertItem } from "../types/api";

export function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  if (alerts.length === 0) return null;

  return (
    <div
      style={{
        border: "1px solid #fecaca",
        backgroundColor: "#fef2f2",
        borderRadius: "12px",
        padding: "18px 24px",
        margin: "20px 0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "18px" }}>🚨</span>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#991b1b" }}>
          Active Alerts ({alerts.length})
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {alerts.map((a) => {
          const isCritical = a.severity === "CRITICAL";
          return (
            <div
              key={a.inverterId}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                backgroundColor: "#ffffff",
                border: "1px solid #fee2e2",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    fontSize: "14px",
                  }}
                >
                  {a.inverterId}
                </span>
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "13px",
                    backgroundColor: "#f3f4f6",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {a.plantId}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  PR: <span style={{ fontWeight: 600 }}>{(a.performanceRatio * 100).toFixed(1)}%</span>
                </span>

                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    padding: "4px 8px",
                    borderRadius: "9999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: isCritical ? "#ffffff" : "#9a3412",
                    backgroundColor: isCritical ? "#ef4444" : "#ffedd5",
                    boxShadow: isCritical ? "0 1px 2px rgba(239, 68, 68, 0.4)" : "none",
                  }}
                >
                  {a.severity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
