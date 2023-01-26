import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

import { Poppins } from '@next/font/google';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-grid-[#C6C6C6]">
      <main className={poppins.className}>
        <Component {...pageProps} />
        <Analytics />
      </main>
    </div>
  );
}

export default MyApp;
