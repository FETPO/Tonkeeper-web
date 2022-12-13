import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Footer, PageKind } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { storageContext } from '@tonkeeper/uikit/dist/hooks/storage';
import { translationContext } from '@tonkeeper/uikit/dist/hooks/translation';
import { any, AppRoute } from '@tonkeeper/uikit/dist/libs/routes';
import { useLanguage } from '@tonkeeper/uikit/dist/state/language';
import { useNetwork } from '@tonkeeper/uikit/dist/state/network';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import {
  Body,
  Container,
  GlobalStyle,
} from '@tonkeeper/uikit/dist/styles/globalStyle';
import {
  FC,
  PropsWithChildren,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { BrowserStorage } from './libs/storage';
import { Activity } from './pages/Activity';
import { Home } from './pages/Home';
import { SettingsRouter } from './pages/settings';

const queryClient = new QueryClient();
const storage = new BrowserStorage();

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />
        <Suspense fallback="...is loading">
          <translationContext.Provider value={t}>
            <storageContext.Provider value={storage}>
              <BrowserRouter>
                <Loader>{children}</Loader>
              </BrowserRouter>
            </storageContext.Provider>
          </translationContext.Provider>
        </Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export const Loader: FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const { data: network, isFetching: isNetworkLoading } = useNetwork();
  const { data: language, isFetching: isLanguageLoading } = useLanguage();

  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n
        .reloadResources([language])
        .then(() => i18n.changeLanguage(language));
    }
  }, [language, i18n]);

  console.log(network, isNetworkLoading);
  console.log(language, isLanguageLoading);

  return <>{children}</>;
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
      <Body>
        <Routes>
          <Route path={AppRoute.activity} element={<Activity />} />
          <Route path={any(AppRoute.settings)} element={<SettingsRouter />} />
          <Route
            path="*"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
        </Routes>
      </Body>
      <Footer active={active} onClick={setActive} />
    </Container>
  );
};
