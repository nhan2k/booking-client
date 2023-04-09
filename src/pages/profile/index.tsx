import { GetServerSideProps } from 'next';
import React from 'react';
import { signOut, useSession } from 'next-auth/react';

type Props = {};

function Page({}: Props) {
  const { data: session } = useSession();
  const user = session?.user;
  if ((user as any)?.role !== 'admin') {
    return (
      <section className="grid h-screen place-items-center">
        <div className="w-25">
          <p>You do not have permission to view this page!</p>
        </div>
      </section>
    );
  }
  return (
    <>
      <h1>Your Profile</h1>
    </>
  );
}

export default Page;
