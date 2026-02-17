import express from "express";
import { mergeCart } from "../controllers/cart.controller.js";
import { myCart } from "../controllers/cart.controller.js";
import { clearCart } from "../controllers/cart.controller.js";
import { removeCartItem } from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addToCart } from "../controllers/cart.controller.js";
import { updateCartItem } from "../controllers/cart.controller.js";


const router = express.Router();

router.post("/merge", authMiddleware, mergeCart);
router.get("/my-cart", authMiddleware, myCart);
router.delete("/clear", authMiddleware, clearCart);
router.delete("/remove/:cartItemId", authMiddleware, removeCartItem);
router.post("/add", authMiddleware, addToCart);
router.patch("/update/:cartItemId", authMiddleware, updateCartItem);


export default router;