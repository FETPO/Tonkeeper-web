import { FiatCurrencies } from './fiat';
import { Language } from './language';
import { Network } from './network';
import { WalletProxy } from './proxy';

export enum WalletVersion {
  v3R1 = 0,
  v3R2 = 1,
  v4R1 = 2,
  v4R2 = 3,
}

export const WalletVersions = [
  WalletVersion.v3R1,
  WalletVersion.v3R2,
  WalletVersion.v4R2,
];

export const walletVersionText = (version: WalletVersion) => {
  switch (version) {
    case WalletVersion.v3R1:
      return 'v3R1';
    case WalletVersion.v3R2:
      return 'v3R2';
    case WalletVersion.v4R2:
      return 'v4R2';
    default:
      return String(version);
  }
};

export interface WalletAddress {
  friendlyAddress: string;
  rawAddress: string;
  version: WalletVersion;
}

export interface WalletState {
  publicKey: string;
  mnemonic: string;
  revision: number;

  active: WalletAddress;

  name?: string;

  hiddenJettons?: string[];
  orderJettons?: string[];

  network?: Network;
  lang?: Language;
  fiat?: FiatCurrencies;
  theme?: string;

  proxy?: WalletProxy;
}
