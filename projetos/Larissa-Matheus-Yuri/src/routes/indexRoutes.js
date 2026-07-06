import express from "express";
import { getHome } from "../controllers/indexController.js";

const router = express.Router();

router.get("/", getHome);

export default router;