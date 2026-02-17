import express from "express";
import { createOrder, getMyOrders, getOrderById, updateOrderStatus, createCODOrder, cancelOrder } from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js" 

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.post("/create-cod-order", authMiddleware, createCODOrder);
router.patch("/:id/cancel", authMiddleware, cancelOrder);


export default router;
