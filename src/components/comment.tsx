import React from 'react';

interface IDataReview {
  review_id?: number;
  rating?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
  __user__: {
    first_name?: string;
    imgPath?: string;
    last_name?: string;
  };
}
type Props = {
  data: IDataReview[];
  total: number;
};

function Component({ data, total }: Props) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {data?.map((review) => (
        <li
          key={review?.review_id}
          className="flex justify-between gap-x-6 py-5"
        >
          <div className="flex gap-x-4 ">
            <img
              className="h-12 w-12 flex-none rounded-full bg-gray-50"
              src={`${process.env.NEXT_PUBLIC_ENDPOINT}/${review?.__user__?.imgPath}`}
              alt=""
            />
            <div className="min-w-0 flex-auto ">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {review?.__user__?.first_name}{' '}
                {review?.__user__?.last_name}
              </p>
              <p className="mt-1 text-base leading-5 max-w-5xl">
                {review.description}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex sm:flex-col sm:items-end">
            <p className="mt-1 text-xs leading-5 text-gray-500">
              {[...Array(5)].map((star, index) => {
                const currentRating = review?.rating || 0;
                const starClass =
                  index < currentRating
                    ? 'text-yellow-500'
                    : 'text-gray-400';
                return (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${starClass} fill-current inline-block`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0l2.822 6.854 6.178.534-4.71 4.217 1.43 6.142-5.72-3.515L4.28 17.747l1.43-6.142L0 7.389l6.178-.534L10 0z" />
                  </svg>
                );
              })}
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              {review?.created_at
                ? new Date(review.created_at).toDateString()
                : ''}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Component;
