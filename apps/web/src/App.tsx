import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountState } from '@tonkeeper/core/dist/entries/account';
import { Language, languages } from '@tonkeeper/core/dist/entries/language';
import { Footer } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { Loading } from '@tonkeeper/uikit/dist/components/Loading';
import { AppSdkContext } from '@tonkeeper/uikit/dist/hooks/appSdk';
import { StorageContext } from '@tonkeeper/uikit/dist/hooks/storage';
import {
  I18nContext,
  TranslationContext,
} from '@tonkeeper/uikit/dist/hooks/translation';
import { any, AppRoute } from '@tonkeeper/uikit/dist/libs/routes';
import {
  Initialize,
  InitializeContainer,
} from '@tonkeeper/uikit/dist/pages/initialize/Initialize';
import { SettingsRouter } from '@tonkeeper/uikit/dist/pages/settings';
import { UserThemeProvider } from '@tonkeeper/uikit/dist/providers/ThemeProvider';
import { useAccountState } from '@tonkeeper/uikit/dist/state/account';
import { useLanguage } from '@tonkeeper/uikit/dist/state/language';
import { useNetwork } from '@tonkeeper/uikit/dist/state/network';
import { useAuthState } from '@tonkeeper/uikit/dist/state/password';
import { Body, Container } from '@tonkeeper/uikit/dist/styles/globalStyle';
import { FC, PropsWithChildren, Suspense, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BrowserAppSdk } from './libs/appSdk';
import { BrowserStorage } from './libs/storage';
import { Activity } from './pages/Activity';
import { Home } from './pages/Home';

const queryClient = new QueryClient();
const storage = new BrowserStorage();
const sdk = new BrowserAppSdk();

export const App: FC<PropsWithChildren> = () => {
  const { t, i18n } = useTranslation();

  const translation = useMemo(() => {
    const client: I18nContext = {
      t,
      i18n: {
        enable: true,
        reloadResources: i18n.reloadResources,
        changeLanguage: i18n.changeLanguage as any,
        language: i18n.language as Language,
        languages: [...languages],
      },
    };
    return client;
  }, [t, i18n]);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Loading />}>
          <AppSdkContext.Provider value={sdk}>
            <TranslationContext.Provider value={translation}>
              <StorageContext.Provider value={storage}>
                <UserThemeProvider>
                  <Loader />
                </UserThemeProvider>
              </StorageContext.Provider>
            </TranslationContext.Provider>
          </AppSdkContext.Provider>
        </Suspense>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export const Loader: FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const { data: network, isFetching: isNetworkLoading } = useNetwork();
  const { data: language, isFetching: isLanguageLoading } = useLanguage();
  const { data: account, isFetching: isAccountLoading } = useAccountState();
  const { data: auth, isFetching: isAuthLoading } = useAuthState();

  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n
        .reloadResources([language])
        .then(() => i18n.changeLanguage(language));
    }
  }, [language, i18n]);

  console.log(network, isNetworkLoading);
  console.log(language, isLanguageLoading);

  if (
    isNetworkLoading ||
    isLanguageLoading ||
    isAuthLoading ||
    isAccountLoading ||
    !account
  ) {
    return <Loading />;
  }

  return <Content account={account} />;
};

export const Content: FC<{ account: AccountState }> = ({ account }) => {
  if (account.wallets.length === 0) {
    return (
      <Container>
        <InitializeContainer fullHeight={false}>
          <Initialize />
        </InitializeContainer>
      </Container>
    );
  }

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
