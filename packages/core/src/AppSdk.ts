import { IStorage, MemoryStorage } from './Storage';

export interface IAppSdk {
  openPage: (url: string) => Promise<unknown>;
  memoryStore: IStorage;
}

export class MockAppSdk implements IAppSdk {
  openPage = async (url: string): Promise<void> => {
    console.log(url);
  };
  memoryStore = new MemoryStorage();
}
