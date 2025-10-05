import type { AppProps } from 'next/app';
import DemoButton from '../components/DemoButton';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <DemoButton />
    </>
  );
}
