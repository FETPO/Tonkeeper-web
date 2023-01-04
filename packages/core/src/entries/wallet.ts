export const WalletVersions = ['v3R1', 'v3R2', 'v4R2'] as const;

export type WalletVersion = typeof WalletVersions[number];

export interface WalletState {
  revision: number;
  mnemonic: string;
  address: string;
  publicKey: string;
  version: WalletVersion;
  name?: string;
  hiddenJettons?: string[];
  orderJettons?: string[];
  tonkeeperId: string;
}
