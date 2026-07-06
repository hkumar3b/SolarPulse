export interface TelemetryRow {
  timestamp: string;
  plantId: string;
  inverterId: string;
  acPowerKw: number;
  expectedPowerKw: number;
  irradianceWm2: number;
  moduleTempC: number;
  status: "OK" | "FAULT" | "OFFLINE";
}
