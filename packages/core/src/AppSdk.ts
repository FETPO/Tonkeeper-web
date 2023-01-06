import { EventEmitter, IEventEmitter } from './entries/eventEmitter';
import { IStorage, MemoryStorage } from './Storage';

export interface UIEvents {
  unlock: void;
}

export interface IAppSdk {
  openPage: (url: string) => Promise<unknown>;
  memoryStore: IStorage;
  uiEvents: IEventEmitter<UIEvents>;
}

export class MockAppSdk implements IAppSdk {
  openPage = async (url: string): Promise<void> => {
    console.log(url);
  };
  memoryStore = new MemoryStorage();
  uiEvents = new EventEmitter();
}
