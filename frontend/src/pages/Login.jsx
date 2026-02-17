import { useState, useEffect } from "react";
import { loginSchema } from "../schemas/auth.schema";
import { loginUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../hooks/useCart";
import axios from "axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { setCartItems } = useCart();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

/* global google */

const handleGoogleLogin = async (response) => {
  try {
    setLoading(true);

    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
      idToken: response.credential,
    });

    const token = res.data.token;
    const decoded = jwtDecode(token);

    login(token, { id: decoded.userId, role: decoded.role });

    // Merge guest cart for Google login
    const guestCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (guestCart.length > 0) {
      await fetch(`${import.meta.env.VITE_API_URL}/cart/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: guestCart }),
      });
      localStorage.removeItem("cart");
    }

    // Fetch existing cart from DB
    const cartRes = await fetch(`${import.meta.env.VITE_API_URL}/cart/my-cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dbCart = await cartRes.json();
    setCartItems(dbCart.items || []);

    navigate("/");
  } catch (err) {
    console.error("Google login error:", err);
    setErrors({ api: "Google login failed" });
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  const interval = setInterval(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" }
      );

      clearInterval(interval);
    }
  }, 100);

  return () => clearInterval(interval);
}, []);



  // Email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(formData);
      const token = res.data.token;
      const decoded = jwtDecode(token);

      login(token, { id: decoded.userId, role: decoded.role });

      if (decoded.role === "ADMIN") {
        navigate("/admin");
        return;
      }

      // Merge guest cart
      const guestCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (guestCart.length > 0) {
        const formattedGuestCart = guestCart.map((item) => ({
          productId: item.productId,
          qty: item.qty,
          price: item.price,
        }));
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/cart/merge`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ items: formattedGuestCart }),
          });
          localStorage.removeItem("cart");
        } catch (err) {
          console.error("Cart merge failed", err);
        }
      }

      // Fetch cart
      const cartRes = await fetch(`${import.meta.env.VITE_API_URL}/cart/my-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dbCart = await cartRes.json();
      setCartItems(dbCart.items || []);

      navigate("/");
    } catch (err) {
  console.log("FULL ERROR:", err.response?.data); // debug
  setErrors({ api: err.response?.data?.message || err.response?.data?.error || "Login failed" });
}finally {
      setLoading(false);
    }
  };





 return (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-md card p-8">
      <h2 className="text-3xl font-bold text-center mb-2">
        Welcome Back 👋
      </h2>

      <p
        className="text-center mb-8"
        style={{ color: "var(--text-secondary)" }}
      >
        Login to continue shopping
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className={`input-field ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`input-field ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {errors.api && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
            {errors.api}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div
        className="my-6 border-t flex items-center justify-center gap-2 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        <span>or</span>
      </div>

      <div id="googleBtn" className="flex justify-center"></div>

      <div className="flex justify-between text-sm mt-6">
        <span
          className="cursor-pointer hover:underline"
          style={{ color: "var(--text-secondary)" }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </span>

        <span
          className="font-medium cursor-pointer hover:underline"
          style={{ color: "var(--primary)" }}
          onClick={() => navigate("/register")}
        >
          Create account
        </span>
      </div>
    </div>
  </div>
);

};

export default Login;
