// rota da API de atualizar a pontuação do usuário

import express from "express";

import {
    save
} from "../controllers/apiScoreController.js";

const router = express.Router();

router.patch("/savescore", save);

export default router;