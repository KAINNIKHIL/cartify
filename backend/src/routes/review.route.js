import express from "express";
import { upsertReview, getProductReviews } from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:productId", authMiddleware, upsertReview);
router.get("/:productId", getProductReviews);

export default router;
