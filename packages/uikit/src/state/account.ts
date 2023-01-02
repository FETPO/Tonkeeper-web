import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AccountState,
  defaultAccountState,
} from '@tonkeeper/core/dist/entries/account';
import { WalletVersion } from '@tonkeeper/core/dist/entries/wallet';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { updateWalletVersion } from '@tonkeeper/core/dist/service/walletService';
import { IStorage } from '@tonkeeper/core/dist/Storage';
import { useStorage } from '../hooks/storage';

export const getAccountState = async (storage: IStorage) => {
  console.log('load account');
  const state = await storage.get<AccountState>(AppKey.account);
  return state ?? defaultAccountState;
};

export const useAccountState = () => {
  const storage = useStorage();
  return useQuery([AppKey.account], () => getAccountState(storage));
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
  return useMutation<void, Error, string>(async (activeWallet) => {
    let account = await getAccountState(storage);

    account = { ...account, activeWallet };

    await storage.set(AppKey.account, account);
    await client.invalidateQueries([AppKey.account]);
  });
};

export const useMutateLogOut = () => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, void>(async () => {
    await storage.clear();
    await client.invalidateQueries();
  });
};

export const useMutateWalletVersion = () => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, WalletVersion>(async (version) => {
    const { wallets, activeWallet } = await getAccountState(storage);

    const account = {
      wallets: wallets.map((item) => {
        if (item.tonkeeperId === activeWallet) {
          return updateWalletVersion(item, version);
        } else {
          return item;
        }
      }),
      activeWallet,
    };

    await storage.set(AppKey.account, account);
    await client.invalidateQueries([AppKey.account]);
  });
};
