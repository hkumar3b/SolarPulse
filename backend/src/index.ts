import express from "express";
import cors from "cors";
import { loadTelemetry } from "./db";
import { portfolioRouter } from "./routes/portfolio";
import { alertsRouter } from "./routes/alerts";
import { plantRouter } from "./routes/plant";

loadTelemetry("../telemetry.csv"); // adjust path to wherever you keep the CSV

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", portfolioRouter);
app.use("/api", alertsRouter);
app.use("/api", plantRouter);

const PORT = 3001;
app.listen(PORT, () => console.log(`SolarPulse API running on port ${PORT}`));
