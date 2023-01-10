import { EventEmitter, IEventEmitter } from './entries/eventEmitter';
import { IStorage, MemoryStorage } from './Storage';

export interface UIEvents {
  unlock: void;
  copy: void;
}

export interface IAppSdk {
  copyToClipboard: (value: string) => void;
  openPage: (url: string) => Promise<unknown>;
  memoryStore: IStorage;
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
  memoryStore = new MemoryStorage();
  uiEvents = new EventEmitter();
  version = '0.0.0';
}
