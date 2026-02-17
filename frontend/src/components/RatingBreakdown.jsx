const RatingBreakdown = ({ reviews, loading = false }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div
        className="p-6 rounded-2xl border shadow-sm"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-secondary)",
          borderColor: "var(--text-secondary)",
        }}
      >
        {loading ? (
          <div className="space-y-4">
            <div className="w-16 h-8 bg-gray-300 rounded animate-skeleton"></div>
            <div className="w-24 h-4 bg-gray-300 rounded animate-skeleton"></div>
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-3 bg-gray-300 rounded animate-skeleton"></div>
                <div className="flex-1 h-2 bg-gray-300 rounded overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-skeleton"></div>
                </div>
                <div className="w-12 h-3 bg-gray-300 rounded animate-skeleton"></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm">No ratings yet.</p>
        )}
      </div>
    );
  }

  const total = reviews.length;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent = Math.round((count / total) * 100);
    return { star, count, percent };
  });

  const average = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / total
  ).toFixed(1);

  return (
    <div
      className="p-6 rounded-2xl border shadow-sm"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--text-secondary)",
        color: "var(--text-main)",
      }}
    >
      {loading ? (
        <div className="space-y-4">
          <div className="w-16 h-8 bg-gray-300 rounded animate-skeleton"></div>
          <div className="w-24 h-4 bg-gray-300 rounded animate-skeleton"></div>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-3 bg-gray-300 rounded animate-skeleton"></div>
              <div className="flex-1 h-2 bg-gray-300 rounded overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-skeleton"></div>
              </div>
              <div className="w-12 h-3 bg-gray-300 rounded animate-skeleton"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center gap-6">

          {/* ⭐ Average Section */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold" style={{ color: "var(--text-main)" }}>
              {average}
            </h2>
            <p className="text-lg" style={{ color: "var(--primary)" }}>★★★★★</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Based on {total} reviews
            </p>
          </div>

          {/* 📊 Breakdown Bars */}
          <div className="flex-1 space-y-2">
            {ratingCounts.map(({ star, percent }) => (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-10 font-medium" style={{ color: "var(--text-main)" }}>
                  {star}★
                </span>
                <div className="flex-1 rounded-full h-2 relative overflow-hidden" style={{ backgroundColor: "var(--bg-main)" }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: "var(--primary)" }}
                  />
                </div>
                <span className="w-12 text-right" style={{ color: "var(--text-secondary)" }}>
                  {percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingBreakdown;
