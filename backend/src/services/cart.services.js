import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/**
 * Get or create cart for user
 */
export const getOrCreateCart = async (userId) => {
     if (!userId) {
    throw new Error("UserId missing in getOrCreateCart");
  }

  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
  }

  return cart;
};

export const mergeGuestCart = async (userId, items) => {
  const cart = await getOrCreateCart(userId);

  for (const item of items) {
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId : cart.id,
      productId: item.productId,
    },
  });

  if (existingItem) {
    // Agar already hai → qty update
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { qty: existingItem.qty + item.qty },
      include: { product: true },
    });
  } else {
    // Agar nahi hai → create
   await prisma.cartItem.create({
  data: {
    cartId: cart.id,
    productId: item.productId,
    qty: item.qty,
    price: item.price,
  },
  include: {              
    product: true,
  },
});

  }
}


  return getOrCreateCart(userId);
};

export const addToCartDB = async (userId, product) => {
  const cart = await getOrCreateCart(userId);

  const existing = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: product.id
    }
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { qty: existing.qty + 1 },
      include: { product: true},
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: product.id,
      qty: 1,
      price: product.price
    },
    include: {
    product: true, 
  },
  });
};

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  //await prisma.cartItem.deleteMany({
    //where: { cartId: cart.id },
  //});
};

export const removeItem = async (userId, cartItemId) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  // check if item exists
  if (!item) {
    throw new Error("Item not found");
  }

  // check if cart exists
  if (!item.cart) {
    throw new Error("Cart not found for this item");
  }

  // check if user owns this cart
  if (item.cart.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.cartItem.delete({ where: { id: cartItemId } });
};


// Update cart item quantity
export const updateItemQty = async (userId, cartItemId, qty) => {
  // Find the cart item and its cart
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });
  
  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new Error("Item not found or unauthorized");
  }

  // Update quantity
  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { qty },
  });
};
