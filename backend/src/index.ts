import express from "express";
import cors from "cors";
import { loadTelemetry } from "./db";
import { portfolioRouter } from "./routes/portfolio";
import { alertsRouter } from "./routes/alerts";
import { plantRouter } from "./routes/plant";
import { authRouter } from "./routes/auth";
import { authenticateToken } from "./middleware/auth";

loadTelemetry("../telemetry.csv"); // adjust path to wherever you keep the CSV

const app = express();
app.use(cors());
app.use(express.json());

// Public auth routes
app.use("/api/auth", authRouter);

// Protected API routes
app.use("/api", authenticateToken, portfolioRouter);
app.use("/api", authenticateToken, alertsRouter);
app.use("/api", authenticateToken, plantRouter);

const PORT = 3001;
app.listen(PORT, () => console.log(`SolarPulse API running on port ${PORT}`));
