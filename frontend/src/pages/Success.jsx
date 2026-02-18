import { useEffect, useState } from "react";
//import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/axios"
import { useSearchParams } from "react-router-dom";


const Success = () => {
  //const { token } = useAuth();
  const { setCartItems } = useCart();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [orderId, setOrderId] = useState(null);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");


 useEffect(() => {
  const verifyPayment = async () => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    try {
      // 1️⃣ Verify Stripe session
      const { data } = await api.post("/payment/verify-session", {
        sessionId,
      });

      setOrderId(data.order?.id || null);

      // 2️⃣ Clear cart
      await api.delete("/cart/clear");

      setCartItems([]);
      setStatus("success");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setStatus("failed");
    }
  };

  verifyPayment();
}, [sessionId, setCartItems]);


  const renderContent = () => {
    if (status === "verifying") {
      return (
        <>
          <div className="text-5xl mb-4 animate-spin">⏳</div>
          <p className="text-lg text-[var(--text-secondary)] animate-pulse">
            Verifying your payment...
          </p>
        </>
      );
    }

    if (status === "success") {
      return (
        <>
          <div className="text-5xl mb-4">✅</div>

          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-3">
            Payment Successful
          </h1>

          {orderId && (
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Order ID: <strong>{orderId}</strong>
            </p>
          )}

          <p className="text-[var(--text-secondary)] mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-xl border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--bg-main)] transition"
            >
              Continue Shopping
            </button>
          </div>
        </>
      );
    }

    if (status === "failed") {
      return (
        <>
          <div className="text-5xl mb-4">❌</div>

          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-3">
            Payment Failed
          </h1>

          <p className="text-[var(--text-secondary)] mb-6">
            Something went wrong while verifying your payment.
          </p>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-3 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition"
          >
            Retry Payment
          </button>
        </>
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4">
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm p-8 text-center max-w-md w-full">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Success;
