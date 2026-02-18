import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
//import { useAuth } from "../hooks/useAuth";
import api from "../services/axios"

const CODSuccess = () => {
  //const { token } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
useEffect(() => {
  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data);
    } catch (err) {
      console.error("Failed to fetch order:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) fetchOrder();
}, [orderId]);


  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </>
    );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[var(--bg-main)] py-12 px-4">
        <div className="max-w-3xl mx-auto bg-[var(--card-bg)] rounded-2xl shadow-sm p-8 text-center">

          {/* Success Title */}
          <h1 className="text-3xl font-bold text-[var(--text-main)] mb-3">
            🎉 Order Placed Successfully!
          </h1>

          <p className="text-[var(--text-secondary)] mb-6">
            Your Cash on Delivery order has been confirmed.
          </p>

          {/* Order Info */}
          <div className="bg-[var(--bg-main)] rounded-xl p-5 mb-6 text-left">
            <p className="mb-2">
              <span className="font-medium text-[var(--text-main)]">
                Order ID:
              </span>{" "}
              {order.id}
            </p>

            <p>
              <span className="font-medium text-[var(--text-main)]">
                Total Amount:
              </span>{" "}
              ₹{order.totalAmount}
            </p>
          </div>

          {/* Items */}
          <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6 text-left">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b border-[var(--bg-main)] pb-2"
              >
                <span className="text-[var(--text-secondary)]">
                  {item.product?.title || item.productId} × {item.qty}
                </span>
                <span className="font-medium text-[var(--text-main)]">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[var(--text-secondary)] mb-8">
            Status:{" "}
            <span className="font-semibold text-[var(--text-main)]">
              {order.status}
            </span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/orders")}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--bg-main)] transition"
            >
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default CODSuccess;
