import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Language } from '@tonkeeper/core/dist/entries/language';
import { Footer } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { AppSdkContext } from '@tonkeeper/uikit/dist/hooks/appSdk';
import { StorageContext } from '@tonkeeper/uikit/dist/hooks/storage';
import {
  I18nContext,
  TranslationContext,
} from '@tonkeeper/uikit/dist/hooks/translation';
import { any, AppRoute } from '@tonkeeper/uikit/dist/libs/routes';
import { SettingsRouter } from '@tonkeeper/uikit/dist/pages/settings';
import { UserThemeProvider } from '@tonkeeper/uikit/dist/providers/ThemeProvider';
import { Body, Container } from '@tonkeeper/uikit/dist/styles/globalStyle';
import { FC, PropsWithChildren, useMemo } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import browser from 'webextension-polyfill';
import { ExtensionAppSdk } from './libs/appSdk';
import { ExtensionStorage } from './libs/storage';
import { Activity } from './pages/Activity';
import { Home } from './pages/Home';

const queryClient = new QueryClient();
const sdk = new ExtensionAppSdk();
const storage = new ExtensionStorage();

export const Providers: FC<PropsWithChildren> = ({ children }) => {
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
              <UserThemeProvider>{children}</UserThemeProvider>
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

export const App = () => {
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
