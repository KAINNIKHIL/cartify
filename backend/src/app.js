import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import reviewRoutes from "./routes/review.route.js";
import orderRoutes from "./routes/order.route.js"
import googleAuthRoutes from "./routes/googleAuth.route.js";
import addressRoutes from "./routes/address.route.js"
import paymentRoutes from "./routes/payment.route.js";

const app = express()

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes)
app.use("/api/payment", paymentRoutes);

export default app;
