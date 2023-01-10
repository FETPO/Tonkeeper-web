import { useQuery } from '@tanstack/react-query';
import { Language } from '@tonkeeper/core/dist/entries/language';
import { Network } from '@tonkeeper/core/dist/entries/network';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import {
  getServerConfig,
  ServerConfig,
} from '@tonkeeper/core/dist/tonkeeperApi/serviceConfig';

export const useTonenpointConfig = (
  build: string,
  network?: Network,
  lang?: Language
) => {
  return useQuery<ServerConfig, Error>(
    [AppKey.tonkeeperApi, 'config'],
    async () => {
      return getServerConfig({ network, build, lang }, {});
    },
    { enabled: network !== undefined }
  );
};
