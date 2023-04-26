import React from 'react';

type Props = {
  currentRating: number;
  handleRatingClick: (index: number) => void;
};

function Component({ currentRating, handleRatingClick }: Props) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((star, index) => {
        const starClass =
          index < currentRating ? 'text-yellow-500' : 'text-gray-400';
        return (
          <svg
            key={index}
            className={`w-8 h-8 ${starClass} fill-current inline-block cursor-pointer`}
            onClick={() => handleRatingClick(index)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 0l2.822 6.854 6.178.534-4.71 4.217 1.43 6.142-5.72-3.515L4.28 17.747l1.43-6.142L0 7.389l6.178-.534L10 0z" />
          </svg>
        );
      })}
      <p className="ml-3 text-gray-500">{currentRating} of 5</p>
    </div>
  );
}

export default Component;
