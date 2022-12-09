import { Footer, PageKind } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { translationContext } from '@tonkeeper/uikit/dist/hooks/translation';
import { AppRoute } from '@tonkeeper/uikit/dist/libs/routes';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import {
  Body,
  Container,
  GlobalStyle,
} from '@tonkeeper/uikit/dist/styles/globalStyle';
import { FC, PropsWithChildren, Suspense, useCallback, useMemo } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import i18next from './i18n';
import { Activity } from './pages/Activity';
import { Home } from './pages/Home';
import { Settings } from './pages/Settigns';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <Suspense fallback="...is loading">
        <translationContext.Provider value={i18next.t}>
          <BrowserRouter>{children}</BrowserRouter>
        </translationContext.Provider>
      </Suspense>
    </ThemeProvider>
  );
};

export const App = () => {
  const navigate = useNavigate();

  const active = useMemo<PageKind>(() => {
    if (window.location.pathname.includes(AppRoute.activity)) {
      return 'activity';
    }
    if (window.location.pathname.includes(AppRoute.settings)) {
      return 'settings';
    }
    return 'wallet';
  }, [window.location.pathname]);

  const setActive = useCallback(
    (key: PageKind) => {
      switch (key) {
        case 'activity':
          return navigate(AppRoute.activity);
        case 'settings':
          return navigate(AppRoute.settings);
        default:
          return navigate(AppRoute.home);
      }
    },
    [navigate]
  );

  return (
    <Container>
      <Header />
      <Body>
        <Routes>
          <Route path={AppRoute.activity} element={<Activity />} />
          <Route path={AppRoute.settings} element={<Settings />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Body>
      <Footer active={active} onClick={setActive} />
    </Container>
  );
};
