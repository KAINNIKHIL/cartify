import express from "express";
import { googleAuth } from "../controllers/googleAuth.controller.js";

const router = express.Router();

router.post("/", googleAuth);

export default router;
