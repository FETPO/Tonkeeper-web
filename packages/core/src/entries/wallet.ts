export type WalletVersion = 'v3R1' | 'v3R2' | 'v4R2';

export interface WalletState {
  revision: number;
  mnemonic: string;
  address: string;
  publicKey: string;
  version: WalletVersion;
  name?: string;
  assets?: string[];
  tonkeeperId: string;
}
