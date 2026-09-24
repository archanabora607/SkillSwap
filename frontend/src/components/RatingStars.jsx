import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, count, onRate, size = 'md', interactive = false }) => {
  const stars = [1, 2, 3, 4, 5];
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => {
        const isFilled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'text-gray-600'
              }`}
            />
          </button>
        );
      })}
      {count !== undefined && (
        <span className="text-xs text-gray-400 ml-1 font-medium">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
