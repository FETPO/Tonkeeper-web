import { AccountState } from '../entries/account';
import { WalletState } from '../entries/wallet';

export const appendWallet = (
  account: AccountState,
  wallet: WalletState
): AccountState => {
  return {
    wallets: account.wallets.concat([wallet]),
    activeAddress: wallet.address,
  };
};
