import { TonApi } from '../api/Api';

export enum Network {
  MAINNET = '-239',
  TESTNET = '-3',
}

export const defaultNetwork = Network.MAINNET;

export const switchNetwork = (current: Network): Network => {
  return current === Network.MAINNET ? Network.TESTNET : Network.MAINNET;
};

const tonApi = 'https://tonapi.io';
const tonApiTestnet = 'https://testnet.tonapi.io';

const getTonApiEndpoint = (network: Network) => {
  return network === Network.MAINNET ? tonApi : tonApiTestnet;
};

export const getTonClient = (network?: Network) => {
  return new TonApi({
    baseURL: network ? getTonApiEndpoint(network) : undefined,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_TONAPI_CLIENT_KEY}`,
      'Content-Type': 'application/json',
    },
  });
};
