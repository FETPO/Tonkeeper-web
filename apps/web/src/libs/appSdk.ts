import { IAppSdk } from '@tonkeeper/core/dist/AppSdk';

export class BrowserAppSdk implements IAppSdk {
  openPage = (url: string) => {
    window.open(url, '_black');
  };
}
