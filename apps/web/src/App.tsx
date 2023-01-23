import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import {
  languages,
  localizationText,
} from '@tonkeeper/core/dist/entries/language';
import { getTonClient, Network } from '@tonkeeper/core/dist/entries/network';
import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { CopyNotification } from '@tonkeeper/uikit/dist/components/CopyNotification';
import { Footer } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { Loading } from '@tonkeeper/uikit/dist/components/Loading';
import {
  ActivitySkeleton,
  CoinSkeleton,
  SettingsSkeleton,
} from '@tonkeeper/uikit/dist/components/Sceleton';
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
import { UnlockNotification } from '@tonkeeper/uikit/dist/pages/home/UnlockNotification';
import ImportRouter from '@tonkeeper/uikit/dist/pages/import';
import {
  Initialize,
  InitializeContainer,
} from '@tonkeeper/uikit/dist/pages/import/Initialize';
import { UserThemeProvider } from '@tonkeeper/uikit/dist/providers/ThemeProvider';
import { useAccountState } from '@tonkeeper/uikit/dist/state/account';
import { useAuthState } from '@tonkeeper/uikit/dist/state/password';
import {
  useTonendpoint,
  useTonenpointConfig,
} from '@tonkeeper/uikit/dist/state/tonendpoint';
import { useActiveWallet } from '@tonkeeper/uikit/dist/state/wallet';
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
import styled from 'styled-components';
import { BrowserAppSdk } from './libs/appSdk';
import { useAppHeight } from './libs/hooks';
import { BrowserStorage } from './libs/storage';

const Settings = React.lazy(
  () => import('@tonkeeper/uikit/dist/pages/settings')
);
const Activity = React.lazy(
  () => import('@tonkeeper/uikit/dist/pages/activity/Activity')
);

const Coin = React.lazy(() => import('@tonkeeper/uikit/dist/pages/coin/Coin'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const storage = new BrowserStorage();
const sdk = new BrowserAppSdk();
console.log('recreate sdk');

export const App: FC<PropsWithChildren> = () => {
  const { t, i18n } = useTranslation();

  const translation = useMemo(() => {
    const client: I18nContext = {
      t,
      i18n: {
        enable: true,
        reloadResources: i18n.reloadResources,
        changeLanguage: i18n.changeLanguage as any,
        language: i18n.language,
        languages: [...languages].map(localizationText),
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
                  <UnlockNotification sdk={sdk} />
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
    storage
      .get<boolean>(AppKey.lock)
      .then((useLock) => setLock(useLock === true));

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

const Wrapper = styled(Container)`
  @media (min-width: 550px) {
    border-left: 1px solid ${(props) => props.theme.backgroundContentTint};
    border-right: 1px solid ${(props) => props.theme.backgroundContentTint};
  }
`;

export const Loader: FC = () => {
  const { data: activeWallet } = useActiveWallet();

  const lock = useLock();
  const { i18n } = useTranslation();
  const { data: account } = useAccountState();
  const { data: auth } = useAuthState();

  const tonendpoint = useTonendpoint(
    sdk.version,
    activeWallet?.network,
    activeWallet?.lang
  );
  const { data: config } = useTonenpointConfig(tonendpoint);

  const navigate = useNavigate();
  useAppHeight();

  useEffect(() => {
    if (
      activeWallet &&
      activeWallet.lang &&
      i18n.language !== localizationText(activeWallet.lang)
    ) {
      i18n
        .reloadResources([localizationText(activeWallet.lang)])
        .then(() => i18n.changeLanguage(localizationText(activeWallet.lang)));
    }
  }, [activeWallet, i18n]);

  if (
    auth === undefined ||
    account === undefined ||
    config === undefined ||
    lock === undefined
  ) {
    return <Loading />;
  }

  const network = activeWallet?.network ?? Network.MAINNET;
  const fiat = activeWallet?.fiat ?? FiatCurrencies.USD;
  const context = {
    tonApi: getTonClient(config, network),
    auth,
    fiat,
    account,
    config,
    tonendpoint,
  };

  return (
    <OnImportAction.Provider value={navigate}>
      <AfterImportAction.Provider value={() => navigate(AppRoute.home)}>
        <AppContext.Provider value={context}>
          <Wrapper>
            <Content activeWallet={activeWallet} lock={lock} />
          </Wrapper>
          <CopyNotification />
        </AppContext.Provider>
      </AfterImportAction.Provider>
    </OnImportAction.Provider>
  );
};

export const Content: FC<{
  activeWallet?: WalletState | null;
  lock: boolean;
}> = ({ activeWallet, lock }) => {
  const location = useLocation();

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
      <Routes>
        <Route
          path={AppRoute.activity}
          element={
            <Suspense fallback={<ActivitySkeleton />}>
              <Activity />
            </Suspense>
          }
        />
        <Route
          path={any(AppRoute.settings)}
          element={
            <Suspense fallback={<SettingsSkeleton />}>
              <Settings />
            </Suspense>
          }
        />
        <Route path={AppRoute.coins}>
          <Route
            path=":name"
            element={
              <Body>
                <Suspense fallback={<CoinSkeleton />}>
                  <Coin />
                </Suspense>
              </Body>
            }
          />
        </Route>
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
      <Footer />
    </WalletStateContext.Provider>
  );
};
