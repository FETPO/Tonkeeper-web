import { WalletState } from './wallet';

export interface AccountState {
  wallets: WalletState[];
  activeAddress?: string;
}

export const defaultAccountState: AccountState = {
  wallets: [],
};
