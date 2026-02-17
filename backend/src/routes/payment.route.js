import express from "express";
import { createCheckoutSession, verifySession } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.post("/verify-session", authMiddleware, verifySession);


export default router;
