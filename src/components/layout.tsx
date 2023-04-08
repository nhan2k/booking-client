import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

type Props = { children: React.ReactNode };

function Layout({ children }: Props) {
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === 'authenticated') {
      sessionStorage.setItem('access-token', session?.access_token);
      sessionStorage.setItem('refresh-token', session?.refresh_token);
    } else {
      sessionStorage.removeItem('access-token');
      sessionStorage.removeItem('refresh-token');
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>Hotel Booking</title>
        <meta name="description" content="Hotel Booking" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar session={session} status={status} />
      <main>
        <div className="bg-white">
          <div className="relative isolate px-6 pt-14 lg:px-8">
            {children}
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}

export default Layout;
