import { Configuration } from '../tonApi';
import { ServerConfig } from '../tonkeeperApi/serviceConfig';

export enum Network {
  MAINNET = '-239',
  TESTNET = '-3',
}

export const defaultNetwork = Network.MAINNET;

export const switchNetwork = (current: Network): Network => {
  return current === Network.MAINNET ? Network.TESTNET : Network.MAINNET;
};

export const getTonClient = (config: ServerConfig) => {
  return new Configuration({
    basePath: 'https://tonapi.io',
    // headers: {
    //   Authorization: `Bearer ${config.tonApiKey}`,
    // },
  });
};
