import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";
import type { InverterDetail } from "../types/api";

export function PowerChart({ inverter }: { inverter: InverterDetail }) {
  const data = inverter.timeSeries.map((point) => ({
    ...point,
    label: point.timestamp.slice(5, 16).replace("T", " "),
  }));

  const faultPoints = data.filter((d) => d.status === "FAULT");

  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{ marginBottom: "8px" }}>
        <strong>{inverter.inverterId}</strong>
        {inverter.isAlert && (
          <span style={{ color: "#d32f2f", marginLeft: "8px" }}>
            🔴 Underperforming (PR: {inverter.performanceRatio?.toFixed(2)})
          </span>
        )}
        {!inverter.isAlert && inverter.performanceRatio !== null && (
          <span style={{ color: "#2e7d32", marginLeft: "8px" }}>
            ✅ Healthy (PR: {inverter.performanceRatio.toFixed(2)})
          </span>
        )}
        {faultPoints.length > 0 && (
          <span style={{ color: "#e65100", marginLeft: "8px" }}>
            ⚠ {faultPoints.length} FAULT reading(s) — marked in orange below
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10 }}
            interval={Math.floor(data.length / 12)}
          />
          <YAxis label={{ value: "kW", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="expectedKw"
            name="Expected kW"
            stroke="#bbb"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actualKw"
            name="Actual kW"
            stroke="#1976d2"
            strokeWidth={2}
            dot={false}
          />
          {faultPoints.map((point) => (
            <ReferenceDot
              key={point.timestamp}
              x={point.label}
              y={point.actualKw}
              r={7}
              fill="#e65100"
              stroke="#fff"
              strokeWidth={2}
              ifOverflow="extendDomain"
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
