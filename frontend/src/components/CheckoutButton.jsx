import { stripePromise } from "../utils/stripe";

const handleCheckout = async (cartItems, token, setLoading, setError) => {
  try {
    setLoading(true);
    setError("");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.productId,
            name: item.title,
            price: item.price,
            quantity: item.qty,
          })),
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to create checkout session");
    }

    const data = await response.json();

    const stripe = await stripePromise;

    if (!stripe) {
      throw new Error("Stripe failed to load");
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: data.id,
    });

    if (error) {
      throw new Error(error.message);
    }

  } catch (err) {
    console.error(err);
    setError(err.message || "Payment failed");
  } finally {
    setLoading(false);
  }
};
