// pages/Orders.jsx
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default: // PENDING / CONFIRMED
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="bg-white border rounded-xl shadow animate-pulse p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-3 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
      </div>
      <div className="flex justify-between items-center border-t pt-2">
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
        <div className="h-5 w-20 bg-gray-300 rounded"></div>
      </div>
      <div className="h-8 bg-gray-300 rounded mt-4"></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No orders placed yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-700">
                      Order ID: <span className="font-mono">{order.id}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Placed on: {dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2 border-t pt-2">
                  <p className="font-semibold text-gray-700">Total</p>
                  <p className="font-bold text-lg">₹{order.totalAmount}</p>
                </div>

                <button
                  className="w-full mt-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
