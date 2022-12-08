import { Asset } from '@tonkeeper/uikit/dist/components/Asset';
import { translationContext } from '@tonkeeper/uikit/dist/hooks/translation';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import { ThemeProvider } from 'styled-components';
import i18next from './i18n';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <translationContext.Provider value={i18next.t}>
        <Asset symbol="TON" />
      </translationContext.Provider>
    </ThemeProvider>
  );
}

export default App;
