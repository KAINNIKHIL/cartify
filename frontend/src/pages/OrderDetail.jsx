import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";
import api from "../services/axios"

const OrderDetail = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const statusSteps = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch order:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  fetchOrder();
}, [id]);


  const handleCancel = async () => {
    try {
      setCancelling(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/${id}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel order");
      setOrder(data.order);
      setShowCancelModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : 0;

  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>Loading order...</p>
      </div>
    );

  if (!order)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>Order not found</p>
      </div>
    );

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen py-8 px-4"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <div className="max-w-4xl mx-auto space-y-8">

          {/* HEADER */}
          <div
            className="p-6 rounded-xl shadow-sm border"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "#e5e7eb",
            }}
          >
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-main)" }}
            >
              Order Details
            </h1>

            <p
              className="text-sm mt-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Order ID: <span className="font-mono">{order.id}</span>
            </p>

            <p
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Placed on:{" "}
              {dayjs(order.createdAt).format(
                "ddd, DD MMM YYYY • hh:mm A"
              )}
            </p>
          </div>

          {/* STATUS TRACKER */}
          {order.status !== "CANCELLED" ? (
            <div
              className="p-6 rounded-xl shadow-sm border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "#e5e7eb",
              }}
            >
              <p
                className="font-semibold mb-6"
                style={{ color: "var(--text-main)" }}
              >
                Order Status
              </p>

              <div className="relative flex items-center justify-between">
                <div className="absolute left-7 right-7 top-3 h-1 bg-gray-200" />

                <div
                  className="absolute left-7 top-3 h-1 transition-all duration-500"
                  style={{
                    width: `${
                      (currentStep / (statusSteps.length - 1)) * 100
                    }%`,
                    backgroundColor: "var(--primary)",
                  }}
                />

                {statusSteps.map((step, idx) => (
                  <div key={step} className="flex flex-col items-center flex-1 z-10">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                        idx <= currentStep ? "text-white" : ""
                      }`}
                      style={{
                        backgroundColor:
                          idx <= currentStep
                            ? "var(--primary)"
                            : "var(--card-bg)",
                        borderColor:
                          idx <= currentStep
                            ? "var(--primary)"
                            : "#d1d5db",
                        color:
                          idx <= currentStep
                            ? "#fff"
                            : "var(--text-secondary)",
                      }}
                    >
                      {idx <= currentStep ? "✓" : idx + 1}
                    </div>

                    <span
                      className="text-xs mt-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: "#fee2e2",
                borderColor: "#fecaca",
                color: "#b91c1c",
              }}
            >
              This order has been cancelled.
            </div>
          )}

          {/* ITEMS */}
          <div
            className="p-6 rounded-xl shadow-sm border space-y-4"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "#e5e7eb",
            }}
          >
            <p
              className="font-semibold"
              style={{ color: "var(--text-main)" }}
            >
              Items
            </p>

            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center p-3 rounded-lg"
                style={{ backgroundColor: "#f1f5f9" }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.title}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div>
                    <p style={{ color: "var(--text-main)" }}>
                      {item.product?.title}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Qty: {item.qty}
                    </p>
                  </div>
                </div>

                <p style={{ color: "var(--text-main)" }}>
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div
            className="flex justify-between text-lg font-semibold p-6 rounded-xl shadow-sm border"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "#e5e7eb",
              color: "var(--text-main)",
            }}
          >
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="px-5 py-2 rounded-lg text-white transition"
              style={{ backgroundColor: "var(--primary)" }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "var(--primary-hover)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "var(--primary)")
              }
            >
              Back to Orders
            </button>

            {["PENDING", "CONFIRMED"].includes(order.status) && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-5 py-2 rounded-lg border transition"
                style={{
                  borderColor: "#ef4444",
                  color: "#ef4444",
                }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div
            className="p-6 rounded-xl w-full max-w-sm shadow-lg"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h2
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--text-main)" }}
            >
              Cancel Order?
            </h2>

            <p
              className="text-sm mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 border rounded-lg"
                style={{ borderColor: "#e5e7eb" }}
              >
                No
              </button>

              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2 text-white rounded-lg transition disabled:opacity-50"
                style={{ backgroundColor: "#ef4444" }}
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetail;
