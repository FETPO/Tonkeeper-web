import { Footer, PageKind } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { translationContext } from '@tonkeeper/uikit/dist/hooks/translation';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import {
  Body,
  Container,
  GlobalStyle,
} from '@tonkeeper/uikit/dist/styles/globalStyle';
import { Suspense, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import i18next from './i18n';

function App() {
  const [active, setActive] = useState<PageKind>('wallet');
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <Suspense fallback="...is loading">
        <translationContext.Provider value={i18next.t}>
          <Container>
            <Header />
            <Body></Body>
            <Footer active={active} onClick={setActive} />
          </Container>
        </translationContext.Provider>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
