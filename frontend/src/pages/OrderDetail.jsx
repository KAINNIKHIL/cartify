import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import dayjs from "dayjs";

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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch order");
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrder();
  }, [id, token]);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
      <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
      <div className="h-4 w-1/5 bg-gray-200 rounded"></div>
      <div className="h-32 bg-gray-100 rounded-lg"></div>
      <div className="h-20 bg-gray-100 rounded-lg"></div>
      <div className="h-6 w-1/6 bg-gray-300 rounded"></div>
      <div className="flex gap-3 mt-2">
        <div className="flex-1 h-10 bg-gray-300 rounded"></div>
        <div className="flex-1 h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  if (loading) return <SkeletonLoader />;

  if (!order) return <p className="text-center mt-10">Order not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Order Details</h1>
        <p className="text-gray-500 text-sm mt-1">
          Order ID: <span className="font-mono">{order.id}</span>
        </p>
        <p className="text-gray-400 text-sm">
          Placed on: {dayjs(order.createdAt).format("ddd, DD MMM YYYY • hh:mm A")}
        </p>
      </div>

      {/* STATUS TRACKER */}
      {order.status !== "CANCELLED" ? (
        <div>
          <p className="font-semibold mb-4">Order Status</p>
          <div className="relative flex items-center justify-between">
            <div className="absolute left-20 right-20 top-3 h-1 bg-gray-200 z-0" />
            <div
              className="absolute left-20 top-3 h-1 bg-green-500 z-0 transition-all duration-500"
              style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
            />
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex flex-col items-center z-10 flex-1">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                    idx <= currentStep
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {idx <= currentStep ? "✓" : idx + 1}
                </div>
                <span className="text-xs mt-2 text-center">{step}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 font-medium">
          This order has been cancelled.
        </div>
      )}

      {/* ITEMS */}
      <div>
        <p className="font-semibold mb-3">Items</p>
        {order?.items?.length > 0 ? (
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.title}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.product?.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                </div>
                <p className="font-medium">₹{item.price * item.qty}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No items found</p>
        )}
      </div>

      {/* ADDRESS */}
      {order?.address && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold mb-1">Delivery Address</p>
          <p>{order.address.fullAddress}</p>
          <p>
            {order.address.city}, {order.address.state} - {order.address.pincode}
          </p>
        </div>
      )}

      {/* TOTAL */}
      <div className="flex justify-between font-semibold text-lg border-t pt-4">
        <span>Total</span>
        <span>₹{order.totalAmount}</span>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition w-full sm:w-auto"
        >
          Back to Orders
        </button>

        {["PENDING", "CONFIRMED"].includes(order.status) && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Cancel Order?</h2>
            <p className="text-sm text-gray-600 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 border rounded-lg"
              >
                No
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
