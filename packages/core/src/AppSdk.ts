import { EventEmitter, IEventEmitter } from './entries/eventEmitter';
import { AuthState } from './entries/password';

export interface UIEvents {
  unlock: void;
  copy: void;
  getPassword: AuthState;
  response: any;
}

export interface IAppSdk {
  copyToClipboard: (value: string) => void;
  openPage: (url: string) => Promise<unknown>;
  uiEvents: IEventEmitter<UIEvents>;
  version: string;
}

export class MockAppSdk implements IAppSdk {
  copyToClipboard = (value: string) => {
    console.log(value);
  };
  openPage = async (url: string): Promise<void> => {
    console.log(url);
  };
  uiEvents = new EventEmitter();
  version = '0.0.0';
}
