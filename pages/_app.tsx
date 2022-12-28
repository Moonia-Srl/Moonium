import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

import { AuthProvider } from '../context/auth';
import { Web3Provider } from '../context/web3';

import 'antd/dist/antd.css';
import 'remixicon/fonts/remixicon.css';
import '../styles/style.scss';

function MyApp({ Component, pageProps }: AppProps) {
  const config = {
    // Retires the same request 3 times before failing completely
    errorRetryCount: 1,
    // Avoids making the same request in the given time window
    dedupingInterval: 30_000,
    // Avoids continuously refreshing the data from the WebService
    // ? Keep it refreshInterval: 10 * 60_000,
    // Default fetcher, wraps the fetch API and returns the JSON object from the Response
    fetcher: async (endpoint: RequestInfo, opt: RequestInit) => {
      const response = await fetch(endpoint, opt);
      // Checks that the API returned data correctly
      if (!response.ok) throw 'errors.api_call_failed';
      return await response.json();
    }
  };

  // Prints out the current version of the Moonium client
  console.warn(`Moonium v${process.env.NEXT_PUBLIC_MOONIUM_VERSION}`);

  return (
    <SWRConfig value={config}>
      <AuthProvider>
        <Web3Provider>
          <Component {...pageProps} />
        </Web3Provider>
      </AuthProvider>
    </SWRConfig>
  );
}

// Configuration object for Next.js i18n
export default MyApp;
