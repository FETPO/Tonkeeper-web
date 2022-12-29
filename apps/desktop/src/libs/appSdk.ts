import { IAppSdk } from '@tonkeeper/core/dist/AppSdk';
import { MemoryStorage } from '@tonkeeper/core/dist/Storage';

export class DesktopAppSdk implements IAppSdk {
  openPage = async (url: string) => {
    console.log(url);
  };
  memoryStore = new MemoryStorage();
}
