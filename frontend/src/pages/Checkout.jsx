import Navbar from "../components/Navbar";
import { useCart } from "../hooks/useCart";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cartItems, totalPrice, setCartItems } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingAddress, setFetchingAddress] = useState(true);

  const isCartEmpty = cartItems.length === 0;

  // Fetch last saved address
  useEffect(() => {
    const fetchLastAddress = async () => {
      if (!token) return;
      try {
        setFetchingAddress(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const addresses = await res.json();

        if (addresses.length > 0) {
          const last = addresses[addresses.length - 1];
          setAddress({
            phone: last.phone,
            address: last.fullAddress,
            city: last.city,
            state: last.state,
            pincode: last.pincode,
          });
        }
      } catch (err) {
        console.error("Fetch last address error:", err);
      } finally {
        setFetchingAddress(false);
      }
    };

    fetchLastAddress();
  }, [token]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (isCartEmpty) {
      setError("Your cart is empty!");
      return false;
    }

    for (let key of Object.keys(address)) {
      if (!address[key].trim()) {
        setError(`Please enter ${key}`);
        return false;
      }
    }

    setError("");
    return true;
  };

  const placeOrder = async (paymentMethod = "stripe") => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Save address
      const addressRes = await fetch(`${import.meta.env.VITE_API_URL}/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      const savedAddress = await addressRes.json();
      if (!addressRes.ok) throw new Error(savedAddress.message);

      const itemsPayload = cartItems.map((item) => ({
        productId: item.productId,
        name: item.title || item.product?.title,
        price: item.price,
        qty: item.qty,
      }));

      if (paymentMethod === "stripe") {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: itemsPayload,
              addressId: savedAddress.id,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Stripe session failed");

        window.location.href = data.url;
      }

      if (paymentMethod === "cod") {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/create-cod-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: itemsPayload,
              addressId: savedAddress.id,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "COD order failed");

        setCartItems([]);
        navigate(`/cod-success/${data.order.id}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 pb-32 md:pb-6 bg-[var(--bg-main)] text-[var(--text-main)]">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        {error && (
          <div className="bg-red-900/20 text-red-400 p-3 rounded-lg mb-4 border border-red-800">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* ADDRESS */}
          <div className="md:col-span-2 border border-[var(--border-color)] rounded-xl p-5 bg-[var(--card-bg)]">
            <h2 className="font-semibold mb-4 text-lg">Delivery Address</h2>

            {fetchingAddress ? (
              <div className="animate-pulse space-y-3">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-300 rounded-lg w-full"
                    />
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["phone", "city", "state", "pincode"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={address[field]}
                    onChange={handleChange}
                    className={`border p-3 rounded-lg bg-transparent text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                      ${error.includes(field) ? "border-red-400" : "border-[var(--border-color)]"}
                    `}
                  />
                ))}

                <textarea
                  name="address"
                  placeholder="Full Address"
                  value={address.address}
                  onChange={handleChange}
                  rows={3}
                  className={`border p-3 rounded-lg md:col-span-2 bg-transparent text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                    ${error.includes("address") ? "border-red-400" : "border-[var(--border-color)]"}
                  `}
                />
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="border border-[var(--border-color)] rounded-xl p-5 h-fit bg-[var(--card-bg)]">
            <h2 className="font-semibold mb-4 text-lg">Order Summary</h2>

            {cartItems.length === 0 ? (
              <p className="text-[var(--text-secondary)]">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm text-[var(--text-secondary)]"
                  >
                    <span>
                      {item.title || item.product?.title} × {item.qty}
                    </span>
                    <span className="text-[var(--text-main)]">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <hr className="my-4 border-[var(--border-color)]" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => placeOrder("stripe")}
                disabled={loading || isCartEmpty}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-black transition py-3 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Pay with Card"}
              </button>

              <button
                onClick={() => placeOrder("cod")}
                disabled={loading || isCartEmpty}
                className="w-full border border-[var(--border-color)] hover:bg-[var(--card-bg)] transition py-3 rounded-xl text-[var(--text-main)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Cash on Delivery"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BAR */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-[var(--card-bg)] border-t border-[var(--border-color)] md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">{cartItems.length} items</p>
              <p className="font-semibold text-lg">₹{totalPrice}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => placeOrder("stripe")}
                disabled={loading}
                className="bg-[var(--primary)] text-black px-4 py-3 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Card"}
              </button>

              <button
                onClick={() => placeOrder("cod")}
                disabled={loading}
                className="border border-[var(--border-color)] px-4 py-3 rounded-xl text-[var(--text-main)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "COD"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
