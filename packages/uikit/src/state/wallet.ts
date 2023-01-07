import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { updateWallet } from '@tonkeeper/core/dist/service/accountService';
import { updateWalletName } from '@tonkeeper/core/dist/service/walletService';
import { useStorage } from '../hooks/storage';
import { getAccountState } from './account';

export const useMutateLogOut = (tonkeeperId: string, remove = false) => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, void>(async () => {
    if (remove) {
      // TODO: clean remote storage by api
    }
    let account = await getAccountState(storage);
    const wallets = account.wallets.filter(
      (item) => item.tonkeeperId !== tonkeeperId
    );

    account = {
      wallets,
      activeWallet: wallets.length > 0 ? wallets[0].tonkeeperId : undefined,
    };

    await storage.set(AppKey.account, account);
    await client.invalidateQueries([AppKey.account]);
  });
};

export const useMutateRenameWallet = (wallet: WalletState) => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, string>(async (name) => {
    if (name.length <= 0) {
      throw new Error('Missing name');
    }

    let account = await getAccountState(storage);

    account = updateWallet(account, updateWalletName(wallet, name));

    await storage.set(AppKey.account, account);
    await client.invalidateQueries([AppKey.account]);
  });
};
