import { IAppSdk } from '@tonkeeper/core/dist/AppSdk';
import { EventEmitter } from '@tonkeeper/core/dist/entries/eventEmitter';
import { MemoryStorage } from '@tonkeeper/core/dist/Storage';

export class DesktopAppSdk implements IAppSdk {
  openPage = async (url: string) => {
    console.log(url);
  };
  memoryStore = new MemoryStorage();
  uiEvents = new EventEmitter();
  version = process.env.REACT_APP_VERSION ?? 'Unknown';
}
