import { Star } from "lucide-react"
import { useState } from "react";

const ProductRating = ({
  maxStars = 5,
  rating = 0,
  onRatingChange,
  readOnly = false,
}) => {
  const [selectedRating, setSelectedRating] = useState(rating);
  const [hover, setHover] = useState(0);

  const handleRating = (currentRating) => {
    setSelectedRating(currentRating);
    if (onRatingChange) {
      onRatingChange(currentRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hover || selectedRating);

        return (
          <button
            key={starValue}
            type="button"
            disabled={readOnly}
            aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
            className={`transition-colors duration-150 focus:outline-none ${
              readOnly ? "cursor-default" : ""
            }`}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={`w-6 h-6 ${
                isFilled 
                  ? "fill-yellow-400 stroke-yellow-500" 
                  : "fill-transparent stroke-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ProductRating;
