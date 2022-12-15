import { IAppSdk } from '@tonkeeper/core/dist/AppSdk';
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
}
