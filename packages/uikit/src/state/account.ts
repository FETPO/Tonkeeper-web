import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AccountState,
  defaultAccountState,
} from '@tonkeeper/core/dist/entries/account';
import { AppKey } from '@tonkeeper/core/dist/Keys';
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
