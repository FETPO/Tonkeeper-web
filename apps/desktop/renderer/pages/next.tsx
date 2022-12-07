import Link from 'next/link';
import React from 'react';
import { Layout } from '../components/Layout';

function Next() {
  return (
    <React.Fragment>
      <Layout>
        <div>
          <p>
            ⚡ Electron + Next.js ⚡ -
            <Link href="/home">
              <a>Go to home page</a>
            </Link>
          </p>
        </div>
      </Layout>
    </React.Fragment>
  );
}

export default Next;
