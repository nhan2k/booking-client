import Link from 'next/link';
import React from 'react';

type Props = {
  pageSize: number;
  currentPage: number;
  totalItems: number;
};

function Pagination({ currentPage, pageSize, totalItems }: Props) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const prevLink =
    currentPage > 1 ? `?page=${currentPage - 1}` : null;
  const nextLink =
    currentPage < totalPages ? `?page=${currentPage + 1}` : null;

  const pageLinks = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      pageLinks.push(
        <li>
          <button
            disabled
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            key={i - 1}
          >
            {i}
          </button>
        </li>
      );
    } else {
      pageLinks.push(
        <li>
          <Link
            href={`?pageNumber=${i}&pageSize=10`}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            key={i + 1}
          >
            {i}
          </Link>
        </li>
      );
    }
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex justify-center items-center -space-x-px">
        {prevLink ? (
          <li>
            <Link
              href={prevLink}
              className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </Link>
          </li>
        ) : (
          <li>
            <button
              disabled
              className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </button>
          </li>
        )}
        {pageLinks}
        {nextLink ? (
          <li>
            <Link
              href={nextLink}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </Link>
          </li>
        ) : (
          <li>
            <button
              disabled
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Pagination;
