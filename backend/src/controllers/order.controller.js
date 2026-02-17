import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Create order
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, addressId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!addressId) {
      return res.status(400).json({ message: "Address is required" });
    }
    
    const newOrder = await prisma.order.create({
      data: {
        user: { connect: { id: req.user.id } },
        totalAmount,
        status: "PENDING",
        address: { connect: { id: addressId } }, // connect to the Address table
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
        address: true, // optional, if you want to return address with order
      },
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: true } }, // Include product details for each item
        address: true, // Include address info
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get a single order by ID (only accessible by the owner or admin)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } }, // Include product details
        address: true, // Include delivery address
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow the user who owns the order (or an admin) to view it
    if (order.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get order by ID error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } }, // optional, useful for admin
        address: true,
      },
    });

    res.json(updatedOrder);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// 3️⃣ Create COD Order
export const createCODOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { items, addressId } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "PENDING",
        paymentMethod: "COD",
        addressId,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            qty: item.qty,
            price: item.price,
          })),
        },
      },
    });

    res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error("COD order error:", err);
    res.status(500).json({ error: "Failed to create COD order" });
  }
};

// controllers/order.controller.js

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    if (["SHIPPED", "DELIVERED"].includes(order.status)) {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    const updatedOrder = await prisma.order.update({
  where: { id },
  data: { status: "CANCELLED" },
  include: {
    items: {
      include: { product: true }, // include product details
    },
    address: true,
  },
});


    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};
