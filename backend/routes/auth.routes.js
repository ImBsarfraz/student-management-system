import express from "express";
import { getPublicKey, getToken } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/auth/token", getToken);
router.get("/auth/public-key", getPublicKey);

export default router;