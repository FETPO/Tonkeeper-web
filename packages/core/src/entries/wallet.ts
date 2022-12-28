export type WalletVersion = 'v3R1' | 'v3R2' | 'v4R1' | 'v4R2';

export interface WalletState {
  name: string;
  mnemonic: string;
  rawAddress: string;
  publicKey: string;
  version: WalletVersion;
}

export interface WalletConfig {
  assets: string[];
}
