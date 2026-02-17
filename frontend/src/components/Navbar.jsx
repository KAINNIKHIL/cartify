import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, X } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { totalItems, setCartItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef(null);
  const accountRef = useRef(null);

  const handleLogout = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    logout();
    setAccountOpen(false);
  };

  // 🔍 Live Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/products/search?query=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        if (data.success) setResults(data.data.slice(0, 6));
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // 🧠 Outside Click Close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResults([]);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setResults([]);
    setMobileSearchOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "#e5e7eb",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* Top Row */}
        <div className="flex items-center justify-between py-4">

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
            ref={searchRef}
            className="hidden md:flex flex-1 mx-8 relative max-w-xl"
          >
            <div
              className="flex w-full rounded-xl overflow-hidden border"
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
                className="px-5 text-white flex items-center justify-center"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <Search size={18} />
              </button>
            </div>

            {results.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border max-h-64 overflow-y-auto"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "#e5e7eb",
                }}
              >
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    style={{ color: "var(--text-main)" }}
                    onClick={() => setResults([])}
                  >
                    {product.title}
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-6">

            {/* Mobile Search Icon */}
            <button
              className="md:hidden"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              {mobileSearchOpen ? <X size={22} /> : <Search size={22} />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative">
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

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-1 text-sm font-medium"
                >
                  <User size={18} />
                  Account
                </button>

                {accountOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-40 rounded-xl shadow-lg border z-50"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      borderColor: "#e5e7eb",
                    }}
                  >
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setAccountOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1 text-sm font-medium">
                <User size={18} />
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Expand */}
        {mobileSearchOpen && (
          <form
            onSubmit={handleSubmit}
            className="md:hidden pb-4 relative"
            ref={searchRef}
          >
            <div
              className="flex rounded-xl overflow-hidden border"
              style={{ borderColor: "#e5e7eb" }}
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 text-white flex items-center justify-center"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <Search size={18} />
              </button>
            </div>

            {results.length > 0 && (
              <div
                className="absolute left-0 right-0 mt-2 rounded-xl shadow-lg border max-h-64 overflow-y-auto"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "#e5e7eb",
                }}
              >
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setResults([]);
                      setMobileSearchOpen(false);
                    }}
                  >
                    {product.title}
                  </Link>
                ))}
              </div>
            )}
          </form>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
