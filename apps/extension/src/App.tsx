import { Footer, PageKind } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { translationContext } from '@tonkeeper/uikit/dist/hooks/translation';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import {
  Body,
  Container,
  GlobalStyle,
} from '@tonkeeper/uikit/dist/styles/globalStyle';
import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import browser from 'webextension-polyfill';

const Wrapper = styled(Container)`
  height: 600px;
`;

function App() {
  const [active, setActive] = useState<PageKind>('wallet');
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <translationContext.Provider value={browser.i18n.getMessage}>
        <Wrapper>
          <Header />
          <Body></Body>
          <Footer active={active} onClick={setActive} />
        </Wrapper>
      </translationContext.Provider>
    </ThemeProvider>
  );
}

export default App;
