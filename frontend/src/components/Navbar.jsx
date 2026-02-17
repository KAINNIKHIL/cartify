import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { totalItems, setCartItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleLogout = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    logout();
    setAccountOpen(false);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/products/search?query=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await res.json();
        if (data.success) setResults(data.data);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setResults([]);
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b shadow-sm"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "#e5e7eb",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto relative">

          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-wide"
            style={{
              fontFamily: "Poppins, sans-serif",
              color: "var(--text-main)",
            }}
          >
            Shop<span style={{ color: "var(--primary)" }}>Ease</span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 mx-6 max-w-lg hidden md:flex flex-col relative"
            ref={searchRef}
          >
            <div
              className="flex rounded-lg overflow-hidden border"
              style={{ borderColor: "#e5e7eb" }}
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 text-sm focus:outline-none"
                style={{ color: "var(--text-main)" }}
              />
              <button
                type="submit"
                className="px-4 flex items-center justify-center text-white"
                style={{ backgroundColor: "var(--primary)" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "var(--primary-hover)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "var(--primary)")
                }
              >
                <Search size={18} />
              </button>
            </div>

            {results.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded shadow-lg z-50 max-h-64 overflow-y-auto border"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "#e5e7eb",
                }}
              >
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="block px-4 py-2 transition"
                    style={{ color: "var(--text-main)" }}
                    onClick={() => setResults([])}
                  >
                    {product.title}
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Actions */}
          <div className="flex items-center gap-6">

            {/* Cart */}
            <Link
              to="/cart"
              className="relative transition"
              style={{ color: "var(--text-main)" }}
            >
              <ShoppingCart size={26} />

              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-3 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-1 text-sm font-medium transition"
                  style={{ color: "var(--text-main)" }}
                >
                  <User size={18} />
                  Account
                </button>

                {accountOpen && (
                  <div
                    className="absolute top-full right-0 w-36 rounded-lg shadow-lg mt-2 border"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      borderColor: "#e5e7eb",
                    }}
                  >
                    <Link
                      to="/orders"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2 transition"
                      style={{ color: "var(--text-main)" }}
                    >
                      Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 transition"
                      style={{ color: "var(--text-main)" }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm font-medium transition"
                style={{ color: "var(--text-main)" }}
              >
                <User size={18} />
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
