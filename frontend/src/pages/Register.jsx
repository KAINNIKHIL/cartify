import { useState } from "react";
import { registerSchema } from "../schemas/auth.schema";
import { registerUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(formData);
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
      const res = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      login(res.data.token);
      navigate("/");
    } catch (err) {
      setErrors({
        api: err.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-md card p-8">
      <h2 className="text-3xl font-bold text-center mb-2">
        Create Account
      </h2>

      <p
        className="text-center mb-8"
        style={{ color: "var(--text-secondary)" }}
      >
        Join us & start shopping 🛒
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Username */}
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`input-field ${
              errors.username ? "border-red-500" : ""
            }`}
          />
          {errors.username && (
            <p className="text-sm text-red-500 mt-1">
              {errors.username}
            </p>
          )}
        </div>

        {/* Email */}
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
            <p className="text-sm text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
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
            <p className="text-sm text-red-500 mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input-field ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* API Error */}
        {errors.api && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
            {errors.api}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <div
        className="my-6 border-t"
        style={{ borderColor: "var(--text-secondary)" }}
      />

      <div className="text-center text-sm">
        <span style={{ color: "var(--text-secondary)" }}>
          Already have an account?{" "}
        </span>

        <span
          className="font-medium cursor-pointer hover:underline"
          style={{ color: "var(--primary)" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </div>
    </div>
  </div>
);

}
export default Register;
