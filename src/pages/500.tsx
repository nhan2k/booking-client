import { useRouter } from 'next/router';
import React from 'react';

type Props = {};

function Custom500({}: Props) {
  const { back } = useRouter();
  return (
    <>
      <h1>500 - Server-side error occurred</h1>
      <button onClick={() => back()}>Back</button>
    </>
  );
}

export default Custom500;
