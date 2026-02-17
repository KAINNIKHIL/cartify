import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useCart } from "../hooks/useCart";

const LIMIT = 8;

const SearchResults = () => {
  const location = useLocation();
  const { cartItems, addToCart } = useCart();
  const loaderRef = useRef(null);

  const query = new URLSearchParams(location.search).get("query");

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* ================= RESET ================= */
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      if (!query || loading || !hasMore) return;

      setLoading(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/search`,
          { params: { query, page, limit: LIMIT } }
        );

        const newProducts = res.data.success ? res.data.data : [];

        setResults((prev) => {
          const merged = page === 1 ? newProducts : [...prev, ...newProducts];

          return Array.from(
            new Map(merged.map((item) => [item.id, item])).values()
          );
        });

        if (newProducts.length < LIMIT) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, query]);

  /* ================= OBSERVER (SENTINEL) ================= */
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: "200px", // preload before bottom
      }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[var(--bg-main)]">
        <div className="max-w-6xl mx-auto p-4">
          <h2 className="text-2xl font-semibold text-[var(--text-main)] mb-6">
            Results for "{query}"
          </h2>

          {results.length === 0 && !loading && (
            <div className="text-center text-[var(--text-secondary)] mt-20">
              No products found.
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product) => {
              const cartItem = cartItems.find(
                (item) => item.productId === product.id
              );

              return (
                <div
                  key={product.id}
                  className="bg-[var(--card-bg)] rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
                >
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-full h-44 object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </Link>

                  <div className="p-4 flex flex-col gap-3">
                    <h3 className="text-sm font-medium text-[var(--text-main)] line-clamp-2 min-h-[40px]">
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-[var(--text-main)]">
                        ₹{product.price}
                      </p>
                      <p className="text-[var(--text-secondary)] line-through text-sm">
                        ₹{Math.round(product.price * 1.3)}
                      </p>
                      <p className="text-green-600 text-sm font-medium">
                        30% off
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          productId: product.id,
                          title: product.title,
                          price: product.price,
                          image: product.images?.[0],
                          qty: 1,
                        })
                      }
                      disabled={!!cartItem}
                      className={`w-full py-2 rounded-lg font-medium transition ${
                        cartItem
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
                      }`}
                    >
                      {cartItem ? "Added to Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 🔥 Invisible Sentinel */}
          <div ref={loaderRef} className="h-10" />

          {loading && (
            <div className="text-center py-6 text-[var(--text-secondary)]">
              Loading more products...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
