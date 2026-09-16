'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  interactive?: boolean;
  onRatingSubmit?: (stars: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating = 0,
  interactive = false,
  onRatingSubmit,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(rating);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const handleClick = (starValue: number) => {
    if (!interactive) return;
    setSelectedRating(starValue);
    if (onRatingSubmit) onRatingSubmit(starValue);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || selectedRating) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => handleClick(star)}
            aria-label={`Rate ${star} stars`}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform p-0.5`}
          >
            <Star
              className={`${starSizes[size]} ${
                isFilled
                  ? 'text-cinema-gold fill-cinema-gold'
                  : 'text-gray-600 fill-transparent'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
