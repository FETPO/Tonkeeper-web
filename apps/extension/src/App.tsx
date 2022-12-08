import { Asset } from '@tonkeeper/uikit/dist/components/Asset';
import { translationContext } from '@tonkeeper/uikit/dist/hooks/translation';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import { ThemeProvider } from 'styled-components';
import browser from 'webextension-polyfill';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <translationContext.Provider value={browser.i18n.getMessage}>
        <Asset symbol="TON" />
      </translationContext.Provider>
    </ThemeProvider>
  );
}

export default App;
