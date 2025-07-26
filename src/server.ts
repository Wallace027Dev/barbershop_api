import "dotenv/config";
import cors from "cors";
import express from "express";
import { router } from "./routes";
import { db } from "../prisma/db";
import { logRequest } from "./middlewares/logger";

const app = express();

app.use(express.json());
app.use(logRequest());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(router);
console.log("CORS_ORIGIN", process.env.CORS_ORIGIN);

async function startServer() {
  try {
    await db.$connect();
    console.log("✅ Conectado ao banco de dados");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
}

startServer();
