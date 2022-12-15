import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Language, languages } from '@tonkeeper/core/dist/entries/language';
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
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import {
  Body,
  Container,
  GlobalStyle,
} from '@tonkeeper/uikit/dist/styles/globalStyle';
import { FC, PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { DesktopAppSdk } from './libs/appSdk';
import { DesktopStorage } from './libs/storage';

const queryClient = new QueryClient();
const sdk = new DesktopAppSdk();
const storage = new DesktopStorage();

export const Providers: FC<PropsWithChildren> = ({ children }) => {
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
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={defaultTheme}>
          <GlobalStyle />
          <AppSdkContext.Provider value={sdk}>
            <StorageContext.Provider value={storage}>
              <TranslationContext.Provider value={translation}>
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
          <Route path={any(AppRoute.settings)} element={<SettingsRouter />} />
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
