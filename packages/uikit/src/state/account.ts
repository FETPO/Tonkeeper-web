import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AccountState,
  defaultAccountState,
} from '@tonkeeper/core/dist/entries/account';
import { WalletVersion } from '@tonkeeper/core/dist/entries/wallet';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { updateWallet } from '@tonkeeper/core/dist/service/accountService';
import { updateWalletVersion } from '@tonkeeper/core/dist/service/walletService';
import { IStorage } from '@tonkeeper/core/dist/Storage';
import { useWalletContext } from '../hooks/appContext';
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

export const useMutateDeleteAll = () => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, void>(async () => {
    // TODO: clean remote storage by api
    await storage.clear();
    //await client.invalidateQueries();
  });
};

export const useMutateWalletVersion = () => {
  const storage = useStorage();
  const client = useQueryClient();
  const wallet = useWalletContext();
  return useMutation<void, Error, WalletVersion>(async (version) => {
    let account = await getAccountState(storage);

    account = updateWallet(account, updateWalletVersion(wallet, version));

    await storage.set(AppKey.account, account);
    await client.invalidateQueries([AppKey.account]);
  });
};
