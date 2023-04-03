import React from 'react';

type Props = { children: React.ReactNode };

function NestedLayout({ children }: Props) {
  return (
    <>
      <h1>nav nested</h1>
      <main>{children}</main>
      <h1>footer nested</h1>
    </>
  );
}

export default NestedLayout;
