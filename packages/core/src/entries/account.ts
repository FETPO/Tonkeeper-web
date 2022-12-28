import { WalletState } from './wallet';

export interface AccountState {
  wallets: WalletState[];
  activeRawAddress?: string;
}

export const defaultAccountState: AccountState = {
  wallets: [],
};
