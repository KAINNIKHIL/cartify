import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    //console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
    //console.log("Google route hit");
    //console.log("Incoming idToken:", idToken);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    //console.log("Ticket:", ticket);
    const payload = ticket.getPayload();
   // console.log("Payload:", payload);
    const { email, name } = payload;
    
    //console.log("Email:", email);

    let user = await prisma.user.findUnique({ where: { email } });
    //console.log("Existing user:", user);

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: name,
          password: null,
          role: "USER",
        },
      });
    }

    const token = generateToken(user.id);

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Google authentication failed" });
  }
};
