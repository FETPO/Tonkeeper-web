import { Asset } from '@tonkeeper/uikit/dist/components/Asset';
import { defaultTheme } from '@tonkeeper/uikit/dist/styles/defaultTheme';
import { ThemeProvider } from 'styled-components';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Asset symbol="TON" />
    </ThemeProvider>
  );
}

export default App;
