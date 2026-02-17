import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { Star } from "lucide-react";
import ReviewList from "./ReviewList";
import RatingBreakdown from "./RatingBreakdown";
import ReviewForm from "./ReviewForm";

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/reviews/${productId}`
        );
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-xl md:text-2xl font-semibold mb-4"
          style={{ color: "var(--text-main)" }}
        >
          Customer Reviews
        </h2>

        {loading ? (
          <div className="space-y-2">
            <div className="w-32 h-6 bg-gray-300 rounded animate-skeleton" />
            <div className="w-full h-3 bg-gray-300 rounded animate-skeleton" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Average Rating */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    style={{
                      color:
                        star <= Math.round(averageRating)
                          ? "var(--primary)"
                          : "var(--text-secondary)",
                      fill:
                        star <= Math.round(averageRating)
                          ? "var(--primary)"
                          : "transparent",
                    }}
                  />
                ))}
              </div>
              <p
                className="text-lg font-medium"
                style={{ color: "var(--text-main)" }}
              >
                {averageRating} out of 5
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                ({reviews.length} review{reviews.length > 1 && "s"})
              </p>
            </div>

            <RatingBreakdown reviews={reviews} />
          </div>
        ) : (
          <p style={{ color: "var(--text-secondary)" }}>
            No reviews yet. Be the first to review this product.
          </p>
        )}
      </div>

      {/* Write Review Button */}
      <button
        onClick={() => setShowForm(true)}
        className="mb-8 px-5 py-2 rounded-lg text-sm font-medium transition"
        style={{ backgroundColor: "var(--primary)", color: "#ffffff" }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--primary)")
        }
      >
        ⭐ Write a Review
      </button>

      {/* Review List */}
      {loading ? (
        <ReviewList reviews={[]} currentUserId={user?.id} loading />
      ) : (
        <ReviewList
          reviews={reviews}
          currentUserId={user?.id}
          onEdit={(review) => {
            setEditingReview(review);
            setShowForm(true);
          }}
        />
      )}

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div
            className="w-[90%] max-w-md rounded-2xl p-6 relative shadow-lg"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <button
              onClick={() => {
                setShowForm(false);
                setEditingReview(null);
              }}
              className="absolute top-3 right-3 text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              ✕
            </button>

            <ReviewForm
              productId={productId}
              existingReview={editingReview}
              onSuccess={(newReview) => {
                setShowForm(false);
                setEditingReview(null);

                setReviews((prev) => {
                  const index = prev.findIndex(
                    (r) => r.userId === newReview.userId
                  );

                  if (index !== -1) {
                    const updated = [...prev];
                    updated[index] = newReview;
                    return updated;
                  }

                  return [newReview, ...prev];
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
