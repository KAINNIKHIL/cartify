import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ImageGallery from "../components/ImageGallery";
import { useCart } from "../hooks/useCart";
import ReviewSection from "../components/ReviewSection.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cartItems, addToCart, updateQty } = useCart();

  const productId = product?.id || product?._id;
  const cartItem = cartItems.find(
    (item) => item.productId === productId || item.product?.id === productId
  );
  const qty = cartItem?.qty || 0;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <div className="h-6 w-3/4 bg-gray-300 rounded animate-skeleton" />
        <div className="h-6 w-1/4 bg-gray-300 rounded animate-skeleton" />
        <div className="h-64 bg-gray-300 rounded animate-skeleton" />
        <div className="h-3 w-full bg-gray-300 rounded animate-skeleton" />
        <div className="h-3 w-5/6 bg-gray-300 rounded animate-skeleton" />
      </div>
    );
  }

  if (!product) {
    return (
      <p className="p-6 text-center" style={{ color: "var(--text-secondary)" }}>
        Product not found
      </p>
    );
  }

  // Unified CTA component
  const CartCTA = () => {
    if (qty === 0) {
      return (
        <button
          onClick={() =>
            addToCart({
              id: productId,
              title: product.title,
              price: product.price,
              image: product.images?.[0],
              qty: 1,
            })
          }
          className="w-full py-3 md:py-4 rounded-xl font-medium transition text-lg"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
        >
          Add to Cart · ₹{product.price}
        </button>
      );
    }

    return (
      <div
        className="flex items-center justify-between rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--text-secondary)" }}
      >
        <button
          onClick={() => updateQty(cartItem?.id, Math.max(0, qty - 1))}
          className="flex-1 py-3 md:py-4 text-xl"
        >
          −
        </button>

        <span
          className="flex-1 text-center font-semibold text-lg"
          style={{ color: "var(--text-main)" }}
        >
          {qty}
        </span>

        <button
          onClick={() => updateQty(cartItem?.id, qty + 1)}
          className="flex-1 py-3 md:py-4 text-xl"
        >
          +
        </button>
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <div className="pb-32 md:pb-16" style={{ backgroundColor: "var(--bg-main)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-10">

          <div className="grid md:grid-cols-2 gap-10">
            {/* LEFT - Images */}
            <ImageGallery images={product.images} />

            {/* RIGHT - Info */}
            <div className="space-y-6">

              {/* Title & Price */}
              <h1 className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-main)" }}>
                {product.title}
              </h1>

              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold" style={{ color: "var(--text-main)" }}>
                  ₹{product.price}
                </p>
                <p className="line-through text-lg" style={{ color: "var(--text-secondary)" }}>
                  ₹{Math.round(product.price * 1.3)}
                </p>
                <p className="font-medium" style={{ color: "var(--primary)" }}>
                  30% off
                </p>
              </div>
              <p className="text-sm text-gray-400">Inclusive of all taxes</p>

              {/* Description */}
              <p className="leading-relaxed" style={{ color: "var(--text-main)" }}>
                {product.description}
              </p>

              {/* Attributes */}
              {product.attributes && (
                <div className="pt-6 border-t border-gray-600">
                  <h3 className="font-semibold mb-3 text-lg" style={{ color: "var(--text-main)" }}>
                    Product Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium capitalize">{key}:</span>
                        <span>{value.toString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery info */}
              <div className="pt-6 border-t border-gray-600 text-sm space-y-1 text-gray-400">
                <p>🚚 Free Delivery in 3–5 days</p>
                <p>🔁 7 Days Easy Returns</p>
                <p>🛡 100% Genuine Product</p>
              </div>

              {/* Desktop CTA */}
              <div className="hidden sm:block mt-6">
                <CartCTA />
              </div>
            </div>
          </div>

          {/* Reviews */}
          <ReviewSection productId={productId} />
        </div>

        {/* Mobile Sticky CTA */}
        <div
          className="fixed bottom-0 left-0 w-full p-4 md:hidden"
          style={{ backgroundColor: "var(--card-bg)", borderTop: "1px solid var(--text-secondary)" }}
        >
          <CartCTA />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
