import { IAppSdk } from '@tonkeeper/core/dist/AppSdk';
import { EventEmitter } from '@tonkeeper/core/dist/entries/eventEmitter';

export class BrowserAppSdk implements IAppSdk {
  copyToClipboard = (value: string) => {
    this.uiEvents.emit('copy', {});
  };
  openPage = async (url: string) => {
    window.open(url, '_black');
  };
  uiEvents = new EventEmitter();
  version = process.env.REACT_APP_VERSION ?? 'Unknown';
}
