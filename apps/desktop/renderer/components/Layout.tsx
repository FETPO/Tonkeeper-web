import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import Head from 'next/head';
import { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from 'styled-components';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&amp;display=swap"
          rel="stylesheet"
        ></link>
        <link rel="icon" href="/favicon.png" />
        <title>Tonkeper</title>
      </Head>
      {children}
    </ThemeProvider>
  );
};
