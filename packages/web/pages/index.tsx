import Head from 'next/head';
import { Asset } from 'uikit/dist/components/Asset';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Tonkeeper</title>
      </Head>
      <Asset symbol="TON" />
    </div>
  );
}
