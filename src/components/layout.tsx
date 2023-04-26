import * as React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useImgPathStore } from '@/zustand';

type Props = { children: React.ReactNode };

function Layout({ children }: Props) {
  const { data: session, status } = useSession();

  const setImgPath = useImgPathStore(
    (state: any) => state.setImgPath
  );
  const imgPath = useImgPathStore((state: any) => state.imgPath);

  React.useEffect(() => {
    if (status === 'authenticated') {
      if (imgPath === '') {
        setImgPath((session?.user as any)?.imgPath);
      }
      sessionStorage.setItem(
        'access-token',
        (session as any)?.access_token
      );
      sessionStorage.setItem(
        'refresh-token',
        (session as any)?.refresh_token
      );
      sessionStorage.setItem('role', (session?.user as any)?.role);
    } else {
      sessionStorage.removeItem('access-token');
      sessionStorage.removeItem('refresh-token');
      sessionStorage.removeItem('role');
    }
  }, [status, (session?.user as any)?.imgPath]);

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
