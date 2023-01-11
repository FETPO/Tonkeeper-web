import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AccountState } from '@tonkeeper/core/dist/entries/account';
import { WalletVersion } from '@tonkeeper/core/dist/entries/wallet';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import {
  accountSelectWallet,
  getAccountState,
} from '@tonkeeper/core/dist/service/accountService';
import {
  getWalletState,
  updateWalletVersion,
} from '@tonkeeper/core/dist/service/walletService';
import { useWalletContext } from '../hooks/appContext';
import { useStorage } from '../hooks/storage';

export const useAccountState = () => {
  const storage = useStorage();
  const client = useQueryClient();
  return useQuery([AppKey.account], async () => {
    const account = await getAccountState(storage);
    await Promise.all(
      account.publicKeys.map((key) =>
        getWalletState(storage, key).then((wallet) => {
          if (wallet) {
            client.setQueryData(
              [AppKey.account, AppKey.wallet, wallet.publicKey],
              wallet
            );
          }
        })
      )
    );
    return account;
  });
};

export const useMutateAccountState = () => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, AccountState>(async (state) => {
    await storage.set(AppKey.account, state);
    await client.invalidateQueries([AppKey.account]);
  });
};

export const useMutateActiveWallet = () => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, string>(async (publicKey) => {
    await accountSelectWallet(storage, publicKey);
    await client.invalidateQueries([AppKey.account]);
  });
};

export const useMutateDeleteAll = () => {
  const storage = useStorage();
  return useMutation<void, Error, void>(async () => {
    // TODO: clean remote storage by api
    await storage.clear();
  });
};

export const useMutateWalletVersion = () => {
  const storage = useStorage();
  const client = useQueryClient();
  const wallet = useWalletContext();
  return useMutation<void, Error, WalletVersion>(async (version) => {
    await updateWalletVersion(storage, wallet, version);
    await client.invalidateQueries([AppKey.account]);
  });
};
