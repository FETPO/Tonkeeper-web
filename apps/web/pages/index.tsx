import { Asset } from '@tonkeeper/uikit/dist/components/Asset';
import Head from 'next/head';

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
