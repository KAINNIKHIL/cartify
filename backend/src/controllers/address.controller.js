import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// Create new address
export const createAddress = async (req, res) => {
  try {
    const { phone, address, city, state, pincode } = req.body;

    // Basic validation
    if (!phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: req.user.id,
        phone,
        fullAddress: address, // maps request 'address' to DB 'fullAddress'
        city,
        state,
        pincode,
      },
    });

    res.status(201).json(newAddress);
  } catch (err) {
    console.error("Create address error:", err);
    res.status(500).json({ message: "Failed to create address" });
  }
};

// Get all addresses of user
export const getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
    });
    res.json(addresses);
  } catch (err) {
    console.error("Get addresses error:", err);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};
