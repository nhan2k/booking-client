import * as React from 'react';
import Router from 'next/router';
import '@/styles/globals.css';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import ErrorBoundary from '@/components/error-boundary';
import Spinner from '@/components/spinner';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      setIsLoading(true);
    });
    Router.events.on('routeChangeComplete', () => {
      setIsLoading(false);
    });

    Router.events.on('routeChangeError', () => {
      setIsLoading(false);
    });
  }, [Router]);

  return getLayout(
    <SessionProvider session={session}>
      <ErrorBoundary>
        {/* Provide the client to your App */}
        <QueryClientProvider client={queryClient}>
          {isLoading ? <Spinner /> : <Component {...pageProps} />}
        </QueryClientProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </ErrorBoundary>
    </SessionProvider>
  );
}
