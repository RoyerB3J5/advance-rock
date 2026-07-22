import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import FormReview from "./FormReview";

function Starts() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const showForm = rating !== null && rating <= 3;
  const total = 5;
  const reviewLink =
    "https://www.google.com/search?sca_esv=70e0bba46e72b857&biw=2048&bih=1017&sxsrf=APpeQnuzVbw5UJLaNgr-YSf-uoTCMs1_0A:1784238673074&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_8mMaNiGGgmNS4Yp8p3yrR06ImX2rs2vxJO5ddMVkbT4LOWFEj9fV43jm1xYMur41wJGnrDeZ-SuEwqx-Hmn19peFDrnfkAy3_2VxD9cxD6WslhQoA%3D%3D&q=Advanced+Concrete+USA,+Inc.+Reviews&sa=X&ved=2ahUKEwiy_bWCl9iVAxVWs5UCHQiXEtsQ0bkNegQIJhAI&cshid=1784238683212646";

  // Move any client-only side effects (redirect) into useEffect so SSR won't break.
  useEffect(() => {
    if (rating !== null && rating === total - 1) {
      if (typeof window !== "undefined") {
        window.location.href = reviewLink;
      }
    }
  }, [rating]);

  const handleRatingSelect = (index: number) => {
    setRating(index);
  };

  const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

  return (
    <>
      <div className="flex justify-center items-center gap-2 px-5">
        {STAR_KEYS.map((key, idx) => {
          const activeIndex = hovered !== null ? hovered : rating;
          const isActive = activeIndex !== null && idx <= activeIndex;
          return (
            <button
              key={key}
              type="button"
              aria-label={`Rate ${idx + 1} stars`}
              className="cursor-pointer transition-colors duration-150 bg-transparent border-0 p-0"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleRatingSelect(idx)}
            >
              {isActive ? (
                <FaStar size={24} className="text-accent" />
              ) : (
                <FaRegStar size={24} className="text-accent" />
              )}
            </button>
          );
        })}
      </div>
      {showForm && <FormReview />}
    </>
  );
}

export default Starts;
