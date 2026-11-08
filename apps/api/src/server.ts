import "dotenv/config";
import express from "express";
import cors from "cors";
import { connect, isConnected } from "./lib/db.js";
import { shopsRouter } from "./routes/shops.js";
import { suppliersRouter } from "./routes/suppliers.js";
import { pickupsRouter } from "./routes/pickups.js";
import { batchesRouter, labRouter } from "./routes/batches.js";
import { overviewRouter } from "./routes/overview.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, db: isConnected() ? "connected" : "disconnected", uptime: process.uptime() });
});

app.use("/api/v1/shops", shopsRouter);
app.use("/api/v1/suppliers", suppliersRouter);
app.use("/api/v1/pickups", pickupsRouter);
app.use("/api/v1/batches", batchesRouter);
app.use("/api/v1/lab", labRouter);
app.use("/api/v1/overview", overviewRouter);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[api]", error);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  try {
    await connect();
    console.log("[api] MongoDB connected");
  } catch (error) {
    console.warn("[api] MongoDB unavailable — starting without persistence.", error);
  }
  app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));
}

start();

export { app };
