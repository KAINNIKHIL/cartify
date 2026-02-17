import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createAddress, getAddresses } from "../controllers/address.controller.js";

const router = express.Router();

// Create a new address
router.post("/", authMiddleware, createAddress);

// Get all addresses of the logged-in user
router.get("/", authMiddleware, getAddresses);

export default router;
