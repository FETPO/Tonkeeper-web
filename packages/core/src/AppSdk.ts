export interface IAppSdk {
  openPage: (url: string) => Promise<unknown>;
}

export class MockAppSdk implements IAppSdk {
  openPage = async (url: string): Promise<void> => {
    console.log(url);
  };
}
