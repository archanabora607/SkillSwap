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
                  ? 'text-amber-500 fill-amber-500 drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]'
                  : 'text-[#E0CFCE] fill-[#FFF8F3]'
              }`}
            />
          </button>
        );
      })}
      {count !== undefined && (
        <span className="text-xs text-[#665550] ml-1 font-semibold">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
