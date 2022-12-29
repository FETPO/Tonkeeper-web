import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountState } from '@tonkeeper/core/dist/entries/account';
import { Language } from '@tonkeeper/core/dist/entries/language';
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
import ImportRouter from '@tonkeeper/uikit/dist/pages/import';
import {
  Initialize,
  InitializeContainer,
} from '@tonkeeper/uikit/dist/pages/import/Initialize';
import { UserThemeProvider } from '@tonkeeper/uikit/dist/providers/ThemeProvider';
import { useAccountState } from '@tonkeeper/uikit/dist/state/account';
import { useNetwork } from '@tonkeeper/uikit/dist/state/network';
import { useAuthState } from '@tonkeeper/uikit/dist/state/password';
import { Body, Container } from '@tonkeeper/uikit/dist/styles/globalStyle';
import React, { FC, useEffect, useMemo } from 'react';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';
import browser from 'webextension-polyfill';
import { ExtensionAppSdk } from './libs/appSdk';
import { ExtensionStorage } from './libs/storage';
import { Activity } from './pages/Activity';
import { Home } from './pages/Home';

const SettingsRouter = React.lazy(
  () => import('@tonkeeper/uikit/dist/pages/settings')
);

const queryClient = new QueryClient();
const sdk = new ExtensionAppSdk();
const storage = new ExtensionStorage();

export const App: FC = () => {
  const translation = useMemo(() => {
    const client: I18nContext = {
      t: browser.i18n.getMessage,
      i18n: {
        enable: false,
        reloadResources: async () => {},
        changeLanguage: async () => {},
        language: browser.i18n.getUILanguage() as Language,
        languages: [],
      },
    };
    return client;
  }, []);

  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AppSdkContext.Provider value={sdk}>
          <StorageContext.Provider value={storage}>
            <TranslationContext.Provider value={translation}>
              <UserThemeProvider>
                <Loader />
              </UserThemeProvider>
            </TranslationContext.Provider>
          </StorageContext.Provider>
        </AppSdkContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

const Wrapper = styled(Container)`
  height: 600px;
`;

export const Loader: FC = () => {
  const { data: network, isFetching: isNetworkLoading } = useNetwork();
  const { data: account, isFetching: isAccountLoading } = useAccountState();
  const { data: auth, isFetching: isAuthLoading } = useAuthState();

  if (isNetworkLoading || isAuthLoading || isAccountLoading || !account) {
    return <Loading />;
  }

  return <Content account={account} />;
};

const useInitialRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash) {
      navigate(window.location.hash.substring(1));
    }
  }, []);
};

export const Content: FC<{ account: AccountState }> = ({ account }) => {
  const location = useLocation();

  useInitialRedirect();

  if (
    account.wallets.length === 0 ||
    location.pathname.startsWith(AppRoute.import)
  ) {
    return (
      <Wrapper>
        <Routes>
          <Route
            path={any(AppRoute.import)}
            element={
              <InitializeContainer fullHeight={false}>
                <ImportRouter />
              </InitializeContainer>
            }
          />
          <Route
            path="*"
            element={
              <InitializeContainer>
                <Initialize onImport={sdk.openExtensionInBrowser} />
              </InitializeContainer>
            }
          />
        </Routes>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
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
    </Wrapper>
  );
};
