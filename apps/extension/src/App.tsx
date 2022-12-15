import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Footer } from '@tonkeeper/uikit/dist/components/Footer';
import { Header } from '@tonkeeper/uikit/dist/components/Header';
import { AppSdkContext } from '@tonkeeper/uikit/dist/hooks/appSdk';
import { StorageContext } from '@tonkeeper/uikit/dist/hooks/storage';
import { TranslationContext } from '@tonkeeper/uikit/dist/hooks/translation';
import { any, AppRoute } from '@tonkeeper/uikit/dist/libs/routes';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import {
  Body,
  Container,
  GlobalStyle,
} from '@tonkeeper/uikit/dist/styles/globalStyle';
import { FC, PropsWithChildren } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import browser from 'webextension-polyfill';
import { ExtensionAppSdk } from './libs/appSdk';
import { ExtensionStorage } from './libs/storage';
import { Activity } from './pages/Activity';
import { Home } from './pages/Home';
import { SettingsRouter } from './pages/settings';

const queryClient = new QueryClient();
const sdk = new ExtensionAppSdk();
const storage = new ExtensionStorage();

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={defaultTheme}>
          <GlobalStyle />
          <AppSdkContext.Provider value={sdk}>
            <StorageContext.Provider value={storage}>
              <TranslationContext.Provider value={browser.i18n.getMessage}>
                {children}
              </TranslationContext.Provider>
            </StorageContext.Provider>
          </AppSdkContext.Provider>
        </ThemeProvider>
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
