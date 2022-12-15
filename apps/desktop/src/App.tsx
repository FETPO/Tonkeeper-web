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
import { useTranslation } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { DesktopAppSdk } from './libs/appSdk';
import { DesktopStorage } from './libs/storage';

const queryClient = new QueryClient();
const sdk = new DesktopAppSdk();
const storage = new DesktopStorage();

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={defaultTheme}>
          <GlobalStyle />
          <AppSdkContext.Provider value={sdk}>
            <StorageContext.Provider value={storage}>
              <TranslationContext.Provider value={t}>
                {children}
              </TranslationContext.Provider>
            </StorageContext.Provider>
          </AppSdkContext.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

export const App = () => {
  return (
    <Container>
      <Body>
        <Routes>
          <Route path={AppRoute.activity} element={<>Activity</>} />
          <Route path={any(AppRoute.settings)} element={<>Settings</>} />
          <Route
            path="*"
            element={
              <>
                <Header />
                Home
              </>
            }
          />
        </Routes>
      </Body>
      <Footer />
    </Container>
  );
};
