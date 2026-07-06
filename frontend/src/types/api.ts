export interface PlantSummary {
  plantId: string;
  actualKwh: number;
  expectedKwh: number;
  performanceRatio: number | null;
  alertCount: number;
}

export interface PortfolioResponse {
  dateRange: { from: string | null; to: string | null };
  totalActualKwh: number;
  totalExpectedKwh: number;
  portfolioPerformanceRatio: number | null;
  alertingInverterCount: number;
  plants: PlantSummary[];
}

export interface TimeSeriesPoint {
  timestamp: string;
  actualKw: number;
  expectedKw: number;
  irradiance: number;
}

export interface InverterDetail {
  inverterId: string;
  performanceRatio: number | null;
  isAlert: boolean;
  status: "OK" | "INSUFFICIENT_DATA";
  totalActualKwh: number;
  totalExpectedKwh: number;
  statusBreakdown: { OK: number; FAULT: number; OFFLINE: number };
  timeSeries: TimeSeriesPoint[];
}

export interface PlantDetailResponse {
  plantId: string;
  inverters: InverterDetail[];
}

export interface AlertItem {
  inverterId: string;
  plantId: string;
  performanceRatio: number;
  severity: "CRITICAL" | "WARNING";
}
