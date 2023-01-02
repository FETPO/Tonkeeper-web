import { IAppSdk } from '@tonkeeper/core/dist/AppSdk';
import { MemoryStorage } from '@tonkeeper/core/dist/Storage';
import browser from 'webextension-polyfill';
import { checkForError } from './utils';

export class ExtensionAppSdk implements IAppSdk {
  openPage = (url: string) => {
    return new Promise((resolve, reject) => {
      browser.tabs.create({ url }).then((newTab) => {
        const error = checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(newTab);
      });
    });
  };

  // TODO: move to background script
  memoryStore = new MemoryStorage();

  static openTab(options: browser.Tabs.CreateCreatePropertiesType) {
    return new Promise((resolve, reject) => {
      browser.tabs.create(options).then((newTab) => {
        const error = checkForError();
        if (error) {
          return reject(error);
        }
        return resolve(newTab);
      });
    });
  }

  closeExtensionInBrowser = () => {
    window.close();
  };

  openExtensionInBrowser = async (
    route: string | null = null,
    queryString: string | null = null
  ) => {
    let extensionURL = browser.runtime.getURL('index.html');

    if (route) {
      extensionURL += `#${route}`;
    }

    if (queryString) {
      extensionURL += `${queryString}`;
    }

    await ExtensionAppSdk.openTab({ url: extensionURL });

    window.close();
  };
}
