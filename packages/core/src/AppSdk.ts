export interface IAppSdk {
  openPage: (url: string) => void;
}

export class MockAppSdk implements IAppSdk {
  openPage = (url: string) => {
    console.log(url);
  };
}
