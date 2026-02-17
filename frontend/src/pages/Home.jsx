import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleViewAll = () => setVisibleCount(products.length);

  // Skeleton placeholders count
  const skeletons = Array(8).fill(0);

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Carousel />
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)]">
                Featured Products
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                Discover our latest collections
              </p>
            </div>

            {!loading && visibleCount < products.length && (
              <button
                onClick={handleViewAll}
                className="text-sm font-medium text-[var(--text-main)] hover:underline"
              >
                View All
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? skeletons.map((_, idx) => (
                  <div key={idx} className="transition transform hover:-translate-y-1">
                    <ProductCard loading={true} />
                  </div>
                ))
              : products.slice(0, visibleCount).map((product) => (
                  <div
                    key={product.id}
                    className={`transition transform hover:-translate-y-1 ${
                      isMobile ? "cursor-pointer" : ""
                    }`}
                    onClick={() => {
                      if (isMobile) navigate(`/product/${product.id}`);
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
