import { IAppSdk } from '@tonkeeper/core/dist/AppSdk';

export class DesktopAppSdk implements IAppSdk {
  openPage = async (url: string) => {
    console.log(url);
  };
}
