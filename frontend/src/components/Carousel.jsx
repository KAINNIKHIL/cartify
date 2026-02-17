import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import banner1 from "/pix1.png";
import banner2 from "/pix2.png";
import banner3 from "/pix3.png";
import banner4 from "/pix4.png";
import banner5 from "/banner5.avif";

const slides = [
  { image: banner2 },
  { image: banner3 },
  { image: banner4 },
  { image: banner1 },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef(null);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  const stopAutoSlide = () => clearInterval(intervalRef.current);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === slides.length) setLoaded(true);
      };
    });
  }, []);

  // Skeleton for carousel
  const SkeletonSlide = () => (
    <div className="min-w-full h-full bg-gray-300 animate-pulse rounded-md"></div>
  );

  return (
    <>
      <div
        className="relative w-full overflow-hidden group"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        <div className="aspect-[16/7] md:aspect-[16/6]">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {loaded
              ? slides.map((slide, index) => (
                  <div key={index} className="min-w-full h-full relative overflow-hidden">
                    <img
                      src={slide.image}
                      alt="banner"
                      className={`w-full h-full object-cover transition-transform duration-[2000ms] ${
                        current === index ? "scale-105" : "scale-100"
                      }`}
                    />
                    <div className="absolute inset-0"></div>
                  </div>
                ))
              : slides.map((_, index) => <SkeletonSlide key={index} />)}
          </div>
        </div>

        {/* Arrows */}
        {loaded && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Dots */}
        {loaded && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`transition-all duration-300 ${
                  current === index
                    ? "w-6 h-2 bg-white rounded-full"
                    : "w-2 h-2 bg-white/50 rounded-full"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* SECONDARY BANNER */}
      <div className="w-full mt-10 px-4 ">
        {loaded ? (
          <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm overflow-hidden">
            <img
              src={banner5}
              alt="Special Offer"
              className="w-full h-[140px] sm:h-[180px] md:h-[220px] object-contain"
            />
          </div>
        ) : (
          <div className="h-[140px] sm:h-[180px] md:h-[220px] bg-gray-300 animate-pulse rounded-2xl"></div>
        )}
      </div>
    </>
  );
};

export default Carousel;
