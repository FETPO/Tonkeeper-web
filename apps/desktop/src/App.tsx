import { Asset } from '@tonkeeper/uikit/dist/components/Asset';
import { translationContext } from '@tonkeeper/uikit/dist/hooks/translation';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';
import i18next from './i18n';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Suspense fallback="...is loading">
        <translationContext.Provider value={i18next.t}>
          <Asset symbol="TON" />
        </translationContext.Provider>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
