import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountState } from '@tonkeeper/core/dist/entries/account';
import { Language, languages } from '@tonkeeper/core/dist/entries/language';
import { getTonClient } from '@tonkeeper/core/dist/entries/network';
import { AuthState } from '@tonkeeper/core/dist/entries/password';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { Footer } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { Loading } from '@tonkeeper/uikit/dist/components/Loading';
import { NftNotification } from '@tonkeeper/uikit/dist/components/nft/NftNotification';
import {
  AppContext,
  WalletStateContext,
} from '@tonkeeper/uikit/dist/hooks/appContext';
import {
  AfterImportAction,
  AppSdkContext,
  OnImportAction,
} from '@tonkeeper/uikit/dist/hooks/appSdk';
import { StorageContext } from '@tonkeeper/uikit/dist/hooks/storage';
import {
  I18nContext,
  TranslationContext,
} from '@tonkeeper/uikit/dist/hooks/translation';
import { any, AppRoute } from '@tonkeeper/uikit/dist/libs/routes';
import { Home } from '@tonkeeper/uikit/dist/pages/home/Home';
import { Unlock } from '@tonkeeper/uikit/dist/pages/home/Unlock';
import ImportRouter from '@tonkeeper/uikit/dist/pages/import';
import {
  Initialize,
  InitializeContainer,
} from '@tonkeeper/uikit/dist/pages/import/Initialize';
import { UserThemeProvider } from '@tonkeeper/uikit/dist/providers/ThemeProvider';
import { useAccountState } from '@tonkeeper/uikit/dist/state/account';
import { useFiatCurrency } from '@tonkeeper/uikit/dist/state/fiat';
import { useLanguage } from '@tonkeeper/uikit/dist/state/language';
import { useNetwork } from '@tonkeeper/uikit/dist/state/network';
import { useAuthState } from '@tonkeeper/uikit/dist/state/password';
import { Body, Container } from '@tonkeeper/uikit/dist/styles/globalStyle';
import React, {
  FC,
  PropsWithChildren,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { BrowserAppSdk } from './libs/appSdk';
import { BrowserStorage } from './libs/storage';
import { Activity } from './pages/Activity';

const SettingsRouter = React.lazy(
  () => import('@tonkeeper/uikit/dist/pages/settings')
);

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

const useLock = () => {
  const [lock, setLock] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    storage.get<AuthState>(AppKey.password).then((item) => {
      if (!item || item.kind === 'none') {
        setLock(false);
      } else {
        sdk.memoryStore.get<string>(AppKey.password).then((pass) => {
          setTimeout(() => setLock(pass === null), 100);
        });
      }
    });

    const unlock = () => {
      setLock(false);
    };
    sdk.uiEvents.on('unlock', unlock);

    return () => {
      sdk.uiEvents.off('unlock', unlock);
    };
  }, []);
  return lock;
};

export const Loader: FC = () => {
  const lock = useLock();
  const { i18n } = useTranslation();
  const { data: network } = useNetwork();
  const { data: language } = useLanguage();
  const { data: account } = useAccountState();
  const { data: auth } = useAuthState();
  const { data: fiat } = useFiatCurrency();

  const navigate = useNavigate();

  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n
        .reloadResources([language])
        .then(() => i18n.changeLanguage(language));
    }
  }, [language, i18n]);

  if (
    !language ||
    !network ||
    !auth ||
    !account ||
    !fiat ||
    lock === undefined
  ) {
    return <Loading />;
  }

  const context = {
    tonApi: getTonClient(network),
    network,
    auth,
    account,
    fiat,
  };

  return (
    <OnImportAction.Provider value={navigate}>
      <AfterImportAction.Provider value={() => navigate(AppRoute.home)}>
        <AppContext.Provider value={context}>
          <Container>
            <Content account={account} lock={lock} />
          </Container>
        </AppContext.Provider>
      </AfterImportAction.Provider>
    </OnImportAction.Provider>
  );
};

export const Content: FC<{ account: AccountState; lock: boolean }> = ({
  account,
  lock,
}) => {
  const location = useLocation();

  const activeWallet = useMemo(() => {
    const wallet = account.wallets.find(
      (item) => item.tonkeeperId === account.activeWallet
    );
    return wallet;
  }, [account]);

  if (lock) {
    return <Unlock />;
  }

  if (!activeWallet || location.pathname.startsWith(AppRoute.import)) {
    return (
      <InitializeContainer fullHeight={false}>
        <Routes>
          <Route path={any(AppRoute.import)} element={<ImportRouter />} />
          <Route path="*" element={<Initialize />} />
        </Routes>
      </InitializeContainer>
    );
  }

  return (
    <WalletStateContext.Provider value={activeWallet}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path={AppRoute.activity}
            element={
              <Body>
                <Activity />
              </Body>
            }
          />
          <Route
            path={any(AppRoute.settings)}
            element={
              <Body>
                <SettingsRouter />
              </Body>
            }
          />
          <Route
            path="*"
            element={
              <>
                <Header />
                <Body>
                  <Home />
                </Body>
              </>
            }
          />
        </Routes>
      </Suspense>
      <Footer />
      <NftNotification />
    </WalletStateContext.Provider>
  );
};
