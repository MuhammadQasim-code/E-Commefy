import { HiStar } from 'react-icons/hi2';
import { useState } from 'react';

export const StarRating = ({ rating = 0, size = 'md', showCount = false, count = 0, className = '' }) => {
  const sizeClasses = { sm: 'w-3.5 h-3.5', md: 'w-4.5 h-4.5', lg: 'w-5.5 h-5.5' };
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars.map((star) => (
        <div key={star} className="relative">
          <HiStar className={`${sizeClasses[size]} text-slate-200 dark:text-slate-600`} />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              width:
                rating >= star
                  ? '100%'
                  : rating > star - 1
                  ? `${(rating - (star - 1)) * 100}%`
                  : '0%',
            }}
          >
            <HiStar className={`${sizeClasses[size]} text-amber-400`} />
          </div>
        </div>
      ))}
      {showCount && (
        <span className="text-sm text-slate-500 dark:text-slate-400 ml-1.5">
          ({count})
        </span>
      )}
    </div>
  );
};

export const InteractiveStarRating = ({ rating = 0, onRate, size = 'lg', className = '' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-8 h-8' };
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none transition-transform duration-200 hover:scale-110"
        >
          <HiStar
            className={`${sizeClasses[size]} transition-colors duration-200 ${
              (hoverRating || rating) >= star
                ? 'text-amber-400'
                : 'text-slate-200 dark:text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
