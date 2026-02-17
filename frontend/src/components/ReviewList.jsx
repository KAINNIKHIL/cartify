import { Star } from "lucide-react";

const ReviewList = ({ reviews, currentUserId, onEdit, loading }) => {
  // If loading, show 3 skeletons
  if (loading) {
    return (
      <div className="space-y-6 mt-6">
        {Array(3)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-5 shadow-sm animate-skeleton"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--text-secondary)" }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar Skeleton */}
                  <div className="w-10 h-10 rounded-full bg-gray-300 animate-skeleton" />
                  <div className="flex flex-col gap-1">
                    {/* Username Skeleton */}
                    <div className="w-20 h-4 bg-gray-300 rounded animate-skeleton" />
                    {/* Stars Skeleton */}
                    <div className="flex gap-1 mt-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-gray-300 rounded animate-skeleton" />
                        ))}
                    </div>
                  </div>
                </div>
                {/* Edit button skeleton */}
                <div className="w-12 h-6 bg-gray-300 rounded animate-skeleton" />
              </div>

              {/* Comment Skeleton */}
              <div className="w-full h-16 bg-gray-300 rounded animate-skeleton" />
            </div>
          ))}
      </div>
    );
  }

  // Render actual reviews
  return (
    <div className="space-y-6 mt-6">
      {reviews.map((review) => {
        const username = review.user?.username || "Anonymous";
        const isCurrentUser = review.userId === currentUserId;

        return (
          <div
            key={review.id}
            className="border rounded-xl p-5 shadow-sm"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--text-secondary)" }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}
                >
                  {username.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-medium" style={{ color: "var(--text-main)" }}>
                    {username}
                  </p>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        style={{
                          color: star <= review.rating ? "var(--primary)" : "var(--text-secondary)",
                          fill: star <= review.rating ? "var(--primary)" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {isCurrentUser && (
                <button
                  onClick={() => onEdit(review)}
                  className="text-sm px-3 py-1 border rounded-md transition"
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-main)")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Edit
                </button>
              )}
            </div>

            {/* Comment */}
            <p className="mt-4 text-sm md:text-base leading-relaxed" style={{ color: "var(--text-main)" }}>
              {review.comment}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
