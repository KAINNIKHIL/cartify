import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios"

const ReviewForm = ({ productId, existingReview, onSuccess }) => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!isAuthenticated) return;
    if (!comment.trim()) return;

    try {
  setLoading(true);

  const { data } = await api.post(
    `/reviews/${productId}`,
    {
      rating,
      comment,
    }
  );

  onSuccess(data);

  setComment("");
  setRating(5);

} catch (err) {
  console.error(
    err.response?.data || err.message
  );
} finally {
  setLoading(false);
}
  }

  if (!isAuthenticated) {
    return (
      <div
        className="mt-6 border rounded-xl p-4 md:p-6 shadow-sm text-center"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-secondary)",
          borderColor: "var(--text-secondary)",
        }}
      >
        Please{" "}
        <span
          className="font-semibold cursor-pointer underline"
          style={{ color: "var(--primary)" }}
          onClick={() => navigate("/login")}
        >
          login
        </span>{" "}
        to write a review.
      </div>
    );
  }

  return (
    <div
      className="mt-6 border rounded-xl p-4 md:p-6 shadow-sm"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--text-secondary)",
      }}
    >
      <h3
        className="text-base md:text-lg font-semibold mb-4"
        style={{ color: "var(--text-main)" }}
      >
        {existingReview ? "Edit your review" : "Write a review"}
      </h3>

      {/* ⭐ Star Rating */}
      {loading ? (
        <div className="flex items-center gap-2 mb-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-7 h-7 md:w-8 md:h-8 bg-gray-300 rounded animate-skeleton"
              />
            ))}
        </div>
      ) : (
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((r) => (
            <button key={r} onClick={() => setRating(r)} className="focus:outline-none">
              <Star
                className="w-7 h-7 md:w-8 md:h-8 transition"
                style={{
                  color: r <= rating ? "var(--primary)" : "var(--text-secondary)",
                  fill: r <= rating ? "var(--primary)" : "transparent",
                }}
              />
            </button>
          ))}
          <span className="ml-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            {rating} / 5
          </span>
        </div>
      )}

      {/* 📝 Comment */}
      {loading ? (
        <div className="w-full h-24 bg-gray-300 rounded-lg animate-skeleton mb-4"></div>
      ) : (
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          className="w-full border rounded-lg p-3 text-sm md:text-base resize-none mb-4 focus:outline-none"
          style={{
            borderColor: "var(--text-secondary)",
            color: "var(--text-main)",
          }}
        />
      )}

      {/* 💾 Action */}
      <button
        onClick={submitReview}
        disabled={loading || !comment.trim()}
        className="w-full md:w-auto px-6 py-3 rounded-lg font-medium transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--primary)",
          color: "#fff",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
      >
        {loading ? "Saving..." : "Submit Review"}
      </button>
    </div>
  );
};

export default ReviewForm;
