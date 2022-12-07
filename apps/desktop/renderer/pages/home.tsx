import { Asset } from '@tonkeeper/uikit/dist/components/Asset';
import Link from 'next/link';
import React from 'react';
import { Layout } from '../components/Layout';

function Home() {
  return (
    <React.Fragment>
      <Layout>
        <div>
          <p>
            ⚡ Electron + Next.js ⚡ -
            <Link href="/next">
              <a>Go to next page</a>
            </Link>
          </p>
          <Asset symbol="TON" />
        </div>
      </Layout>
    </React.Fragment>
  );
}

export default Home;
