import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// 1️⃣ Create or Update Review
export const upsertReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const { productId } = req.params;

    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: { rating, comment },
      create: { rating, comment, userId, productId },
      include: {
        user: { select: { username: true } },
      },
    });

    res.json({ ...review, userId: review.userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit review" });
  }
};

// 2️⃣ Get Reviews for Product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { username: true } },
      },
    });

    const avgRating =
      reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1);

    res.json({
      reviews,
      avgRating: avgRating.toFixed(1),
      total: reviews.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
