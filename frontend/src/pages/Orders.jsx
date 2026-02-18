// pages/Orders.jsx
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
//import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../services/axios"

const Orders = () => {
  //const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(data ?? []);
    } catch (err) {
      console.error(
        "Failed to fetch orders:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);
;

  const getStatusClasses = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const SkeletonCard = () => (
    <div
      className="border rounded-2xl shadow-sm animate-pulse p-5 flex flex-col gap-4"
      style={{ backgroundColor: "var(--card-bg)", borderColor: "#e5e7eb" }}
    >
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

      <div
        className="min-h-screen py-8 px-4"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-3xl font-bold mb-8"
            style={{ color: "var(--text-main)" }}
          >
            My Orders
          </h1>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p
              className="text-center mt-10"
              style={{ color: "var(--text-secondary)" }}
            >
              No orders placed yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "#e5e7eb",
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: "var(--text-main)" }}
                      >
                        Order ID:
                        <span className="font-mono ml-2">
                          {order.id}
                        </span>
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Placed on:{" "}
                        {dayjs(order.createdAt).format(
                          "DD MMM YYYY, hh:mm A"
                        )}
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

                  <div
                    className="flex justify-between items-center mt-3 border-t pt-3"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <p
                      className="font-semibold"
                      style={{ color: "var(--text-main)" }}
                    >
                      Total
                    </p>
                    <p
                      className="font-bold text-lg"
                      style={{ color: "var(--primary)" }}
                    >
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <button
                    className="w-full mt-5 py-2 text-white font-medium rounded-xl transition active:scale-[0.98]"
                    style={{
                      backgroundColor: "var(--primary)",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor =
                        "var(--primary-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor =
                        "var(--primary)")
                    }
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
