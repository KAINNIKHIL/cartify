// routes/product.routes.js
import express from "express";
import {
  getAllProducts,
  getProductById,
  searchProducts, 
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/search", searchProducts); 
router.get("/", getAllProducts);
router.get("/:id", getProductById);


export default router;
