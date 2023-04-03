import { useRouter } from 'next/router';
import React from 'react';

type Props = {};

function Custom404({}: Props) {
  const { back } = useRouter();
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <h1>404 - Page Not Found</h1>
      <button
        onClick={() => back()}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Back
      </button>
    </div>
  );
}

export default Custom404;
