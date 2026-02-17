import Stripe from "stripe";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1️⃣ Create Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { items, addressId } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    //console.log(items[0].name)
    // Prepare Stripe line items
    const line_items = items.map(item => {
      const productName = item.name;
      if (!productName) {
    throw new Error(`Missing product name for productId ${item.productId}`);
  }
  return{
      price_data: {
        currency: "inr",
        unit_amount: item.price * 100, // convert ₹ to paise
        product_data: {
          name: productName,       // required!
          metadata: {
            productId: item.productId, // optional, useful for backend reference
          },
        },
      },
      quantity: item.qty,
    };
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata: {
        userId,
        addressId,
        items: JSON.stringify(items),
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url }); // send full Stripe URL to redirect
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ message: error.message || "Stripe session failed" });
  }
};

// 2️⃣ Verify Payment & Create Order
export const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    // 🛑 Prevent duplicate order creation
    const existingOrder = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId },
    });

    if (existingOrder) {
      return res.json({ success: true, order: existingOrder });
    }

    const userId = session.metadata.userId;
    const addressId = session.metadata.addressId;

    // ✅ Safely parse items, fallback to empty array if metadata missing
    let items = [];
    if (session.metadata.items) {
      try {
        items = JSON.parse(session.metadata.items);
      } catch {
        return res.status(400).json({ error: "Invalid items metadata" });
      }
    } else {
      return res.status(400).json({ error: "No items found in session metadata" });
    }

    // 💰 Calculate total securely
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "CONFIRMED",
        stripeSessionId: sessionId,
        addressId,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            price: item.price,
          })),
        },
      },
    });

    res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

