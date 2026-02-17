import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Cancel = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center px-4">
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm p-8 text-center max-w-md w-full">

          {/* Icon */}
          <div className="text-5xl mb-4">❌</div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">
            Payment Cancelled
          </h2>

          <p className="text-[var(--text-secondary)] mb-6">
            Your payment was not completed. You can try again anytime.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link to="/cart">
              <button className="w-full py-3 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition">
                Return to Cart
              </button>
            </Link>

            <Link to="/">
              <button className="w-full py-3 rounded-xl border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--bg-main)] transition">
                Continue Shopping
              </button>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Cancel;
