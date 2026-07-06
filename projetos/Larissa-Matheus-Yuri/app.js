import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import indexRoutes from "./src/routes/indexRoutes.js";
import authRoutes from "./src/routes/apiAuthRoutes.js";
import scoreRoutes from "./src/routes/apiScoreRoutes.js";
import rankingRoutes from './src/routes/apiRankingRoutes.js';
const app = express();

// recriando __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "src")));

// rotas
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/game", scoreRoutes);
app.use('/ranking', rankingRoutes);
export default app;