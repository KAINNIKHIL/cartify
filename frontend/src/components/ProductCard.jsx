import { Link } from "react-router-dom";

// Skeleton for Product Card
const ProductCardSkeleton = () => (
  <div
    className="
      rounded-2xl overflow-hidden
      shadow-sm animate-pulse
      border
    "
    style={{ backgroundColor: "var(--card-bg)", borderColor: "#e5e7eb" }}
  >
    {/* Image */}
    <div className="w-full h-44 bg-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-skeleton"></div>
    </div>

    {/* Content */}
    <div className="p-4 flex flex-col gap-2">
      <div className="h-5 rounded bg-gray-300 w-3/4"></div>
      <div className="h-5 rounded bg-gray-300 w-1/2"></div>

      <div className="flex gap-2 mt-2">
        <div className="h-5 rounded bg-gray-300 w-12"></div>
        <div className="h-5 rounded bg-gray-300 w-12"></div>
      </div>

      {/* Button */}
      <div className="h-8 rounded-xl mt-3 hidden md:block bg-gray-300"></div>
    </div>
  </div>
);

// Actual Product Card
const ProductCard = ({ product }) => {
  const discountPercent = 30;
  const originalPrice = Math.round(product.price * 1.3);

  return (
    <div
      className="
        rounded-2xl overflow-hidden
        shadow-sm hover:shadow-lg
        transition-all duration-300
        group border
      "
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "#e5e7eb",
      }}
    >
      {/* Image */}
      <div className="relative bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.title}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discountPercent > 0 && (
          <span
            className="absolute top-3 left-3 text-white text-xs font-medium px-2.5 py-1 rounded-md shadow-sm"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h2
          className="text-sm font-medium line-clamp-2 min-h-[42px]"
          style={{ color: "var(--text-main)" }}
        >
          {product.title}
        </h2>

        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold" style={{ color: "var(--text-main)" }}>
            ₹{product.price}
          </p>
          <p className="text-sm line-through" style={{ color: "var(--text-secondary)" }}>
            ₹{originalPrice}
          </p>
          <span className="text-sm font-medium" style={{ color: "var(--primary)" }}>
            {discountPercent}% off
          </span>
        </div>

        {/* Desktop View Button */}
        <Link
          to={`/product/${product.id}`}
          className="
            hidden md:block
            mt-3
            text-center
            text-white
            font-medium
            text-sm
            py-2.5
            rounded-xl
            transition-all duration-200
            shadow-sm hover:shadow-md
          "
          style={{ backgroundColor: "var(--primary)" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "var(--primary-hover)")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "var(--primary)")}
        >
          View
        </Link>
      </div>
    </div>
  );
};

// Wrapper to switch between Skeleton & Real Product
const ProductCardWrapper = ({ product, loading }) => {
  return loading ? <ProductCardSkeleton /> : <ProductCard product={product} />;
};

export default ProductCardWrapper;
