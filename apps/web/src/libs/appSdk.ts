import { IAppSdk } from '@tonkeeper/core/dist/AppSdk';
import { MemoryStorage } from '@tonkeeper/core/dist/Storage';

export class BrowserAppSdk implements IAppSdk {
  openPage = async (url: string) => {
    window.open(url, '_black');
  };
  memoryStore = new MemoryStorage();
}
