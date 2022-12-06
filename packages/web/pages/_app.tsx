import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from 'uikit/dist/styles/defaultTheme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
