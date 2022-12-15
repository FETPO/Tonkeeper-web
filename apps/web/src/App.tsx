import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Footer } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { AppSdkContext } from '@tonkeeper/uikit/dist/hooks/appSdk';
import { StorageContext } from '@tonkeeper/uikit/dist/hooks/storage';
import { TranslationContext } from '@tonkeeper/uikit/dist/hooks/translation';
import { any, AppRoute } from '@tonkeeper/uikit/dist/libs/routes';
import { useLanguage } from '@tonkeeper/uikit/dist/state/language';
import { useNetwork } from '@tonkeeper/uikit/dist/state/network';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import {
  Body,
  Container,
  GlobalStyle,
} from '@tonkeeper/uikit/dist/styles/globalStyle';
import { FC, PropsWithChildren, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { BrowserAppSdk } from './libs/appSdk';
import { BrowserStorage } from './libs/storage';
import { Activity } from './pages/Activity';
import { Home } from './pages/Home';
import { SettingsRouter } from './pages/settings';

const queryClient = new QueryClient();
const storage = new BrowserStorage();
const sdk = new BrowserAppSdk();

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={defaultTheme}>
          <GlobalStyle />
          <Suspense fallback="...is loading">
            <AppSdkContext.Provider value={sdk}>
              <TranslationContext.Provider value={t}>
                <StorageContext.Provider value={storage}>
                  <Loader>{children}</Loader>
                </StorageContext.Provider>
              </TranslationContext.Provider>
            </AppSdkContext.Provider>
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
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
      <Footer />
    </Container>
  );
};
