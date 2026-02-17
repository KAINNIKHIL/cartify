import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageGallery = ({ images = [], loading = false }) => {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = (index) => {
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
    setActive(index);
  };

  const handleScroll = () => {
    const scrollLeft = containerRef.current.scrollLeft;
    const width = containerRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActive(index);
  };

  if (!images.length && !loading) return null;

  // Skeleton array for placeholders
  const skeletons = Array(3).fill(0);

  return (
    <div className="w-full">
      {/* MAIN IMAGE CONTAINER */}
      <div
        className="relative rounded-2xl overflow-hidden pt-4"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {(loading ? skeletons : images).map((img, i) => (
            <div key={i} className="min-w-full snap-center flex justify-center">
              {loading ? (
                <div className="w-full h-[350px] md:h-[500px] rounded-2xl bg-gray-300 relative overflow-hidden animate-skeleton">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-skeleton"></div>
                </div>
              ) : (
                <img
                  src={img}
                  alt={`product-${i}`}
                  className="
                    w-full
                    h-[350px]
                    md:h-[500px]
                    object-cover
                    transition
                    duration-300
                    hover:scale-105
                  "
                />
              )}
            </div>
          ))}
        </div>

        {/* Desktop Arrows */}
        {!loading && images.length > 1 && (
          <>
            <button
              onClick={() =>
                scrollToIndex(active === 0 ? images.length - 1 : active - 1)
              }
              className="
                hidden md:flex
                absolute left-4 top-1/2 -translate-y-1/2
                p-2 rounded-full shadow transition
              "
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <ChevronLeft size={20} color="var(--text-main)" />
            </button>

            <button
              onClick={() =>
                scrollToIndex(active === images.length - 1 ? 0 : active + 1)
              }
              className="
                hidden md:flex
                absolute right-4 top-1/2 -translate-y-1/2
                p-2 rounded-full shadow transition
              "
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <ChevronRight size={20} color="var(--text-main)" />
            </button>
          </>
        )}

        {/* Mobile Dots */}
        {!loading && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
            {images.map((_, i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full transition"
                style={{
                  backgroundColor: active === i ? "var(--primary)" : "var(--text-secondary)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP THUMBNAILS */}
      {!loading && images.length > 1 && (
        <div className="hidden md:flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className="w-20 h-20 rounded-lg overflow-hidden border transition"
              style={{
                borderColor: active === i ? "var(--primary)" : "var(--text-secondary)",
              }}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
