import { IAppSdk } from '@tonkeeper/core/dist/AppSdk';
import browser from 'webextension-polyfill';
import { checkForError } from './utils';

export class ExtensionAppSdk implements IAppSdk {
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
