// rota de api pegar ranking
import express from "express";
import { getRanking } from "../controllers/apiRankingController.js";

const router = express.Router();

router.get("/top10", getRanking);

export default router;