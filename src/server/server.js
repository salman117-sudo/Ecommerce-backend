import express from "express";
import cors from "cors";
import morgan from "morgan";
import dns from "dns";
import env from "#env";
import paymentRoutes from "../routes/paymentRoutes.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/payments", paymentRoutes);

export default app;