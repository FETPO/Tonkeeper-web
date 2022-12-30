import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountState } from '@tonkeeper/core/dist/entries/account';
import { Language } from '@tonkeeper/core/dist/entries/language';
import { getTonClient } from '@tonkeeper/core/dist/entries/network';
import { Footer } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { Loading } from '@tonkeeper/uikit/dist/components/Loading';
import { AppContext } from '@tonkeeper/uikit/dist/hooks/appContext';
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
import SettingsRouter from '@tonkeeper/uikit/dist/pages/settings';
import { UserThemeProvider } from '@tonkeeper/uikit/dist/providers/ThemeProvider';
import { useAccountState } from '@tonkeeper/uikit/dist/state/account';
import { useNetwork } from '@tonkeeper/uikit/dist/state/network';
import { useAuthState } from '@tonkeeper/uikit/dist/state/password';
import { Body, Container } from '@tonkeeper/uikit/dist/styles/globalStyle';
import React, { FC, PropsWithChildren, useEffect, useMemo } from 'react';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const sdk = new ExtensionAppSdk();
const storage = new ExtensionStorage();

export const App: FC = () => {
  console.log('app');

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
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <InitialRedirect>
          <AppSdkContext.Provider value={sdk}>
            <StorageContext.Provider value={storage}>
              <TranslationContext.Provider value={translation}>
                <UserThemeProvider>
                  <Loader />
                </UserThemeProvider>
              </TranslationContext.Provider>
            </StorageContext.Provider>
          </AppSdkContext.Provider>
        </InitialRedirect>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const Wrapper = styled(Container)`
  height: 600px;
`;

export const Loader: FC = React.memo(() => {
  const { data: network } = useNetwork();
  const { data: account } = useAccountState();
  const { data: auth } = useAuthState();

  const context = useMemo(() => {
    return {
      tonApi: getTonClient(network),
      network: network!,
      account: account!,
      auth: auth!,
    };
  }, [network, account, auth]);

  console.log('Loader', network, account, auth);

  if (!network || !account || !auth) {
    return <Loading />;
  }

  return (
    <AppContext.Provider value={context}>
      <Content account={account} />
    </AppContext.Provider>
  );
});

const InitialRedirect: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash) {
      console.log('navigate');
      navigate(window.location.hash.substring(1));
    }
  }, []);

  return <>{children}</>;
};

export const Content: FC<{ account: AccountState }> = ({ account }) => {
  const location = useLocation();

  console.log('Content');
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
