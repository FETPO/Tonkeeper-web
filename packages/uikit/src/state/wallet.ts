import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import {
  accountLogOutWallet,
  getAccountState,
} from '@tonkeeper/core/dist/service/accountService';
import {
  getWalletState,
  updateWalletProperty,
} from '@tonkeeper/core/dist/service/walletService';
import { useAppContext } from '../hooks/appContext';
import { useStorage } from '../hooks/storage';

export const useActiveWallet = () => {
  const storage = useStorage();
  return useQuery<WalletState | null, Error>(
    [AppKey.account, AppKey.wallet],
    async () => {
      const account = await getAccountState(storage);
      if (!account.activePublicKey) return null;
      return await getWalletState(storage, account.activePublicKey);
    }
  );
};

export const useWalletState = (publicKey: string) => {
  const storage = useStorage();
  return useQuery<WalletState | null, Error>(
    [AppKey.account, AppKey.wallet, publicKey],
    () => getWalletState(storage, publicKey)
  );
};

export const useMutateLogOut = (publicKey: string, remove = false) => {
  const storage = useStorage();
  const client = useQueryClient();
  const { tonApi } = useAppContext();
  return useMutation<void, Error, void>(async () => {
    await accountLogOutWallet(storage, tonApi, publicKey, remove);
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

    await updateWalletProperty(storage, wallet, { name });
    await client.invalidateQueries([AppKey.account]);
  });
};
