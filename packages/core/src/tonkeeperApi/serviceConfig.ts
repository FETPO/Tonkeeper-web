import { Network } from '../entries/network';
import { FetchAPI } from '../tonApi';

interface BootParams {
  platform?: 'ios' | 'android';
  lang?: 'en' | 'ru';
  build?: string; // "2.8.0"
  network?: Network;
  chainName?: 'testnet' | 'mainnet';
}
interface BootOptions {
  fetchApi?: FetchAPI;
}

export interface ServerConfig {
  flags?: { [key: string]: boolean };
  tonendpoint: string;

  tonApiKey?: string;
  tonapiIOEndpoint?: string;

  amplitudeKey?: string;

  NFTOnExplorerUrl?: string;

  exchangePostUrl?: string;
  supportLink?: string;

  mercuryoSecret?: string;
  neocryptoWebView?: string;
}

export const defaultTonendpointConfig: ServerConfig = {
  tonendpoint: 'https://api.tonkeeper.com',
  flags: {},
};

export const getServerConfig = async (
  { lang = 'en', build = '2.8.0', network, platform = 'ios' }: BootParams,
  { fetchApi = fetch }: BootOptions
): Promise<ServerConfig> => {
  const params = new URLSearchParams({
    lang,
    build,
    chainName: network === Network.TESTNET ? 'testnet' : 'mainnet',
    platform,
  });

  const response = await fetchApi(
    //`https://boot.tonkeeper.com/keys?${params.toString()}`
    `http://localhost:1339/keys?${params.toString()}`
  );

  const config = await response.json();

  return {
    tonendpoint: 'https://api.tonkeeper.com',
    flags: {},
    ...config,
  };
};
