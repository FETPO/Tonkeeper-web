import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultLanguage,
  Language,
} from '@tonkeeper/core/dist/entries/language';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { updateWalletProperty } from '@tonkeeper/core/dist/service/walletService';
import { useWalletContext } from '../hooks/appContext';
import { useStorage } from '../hooks/storage';

export const useLanguage = () => {
  const storage = useStorage();
  return useQuery([AppKey.lang], async () => {
    const lang = await storage.get<Language>(AppKey.lang);
    return lang ?? defaultLanguage;
  });
};

export const useMutateLanguage = () => {
  const storage = useStorage();
  const client = useQueryClient();
  const wallet = useWalletContext();
  return useMutation<void, Error, Language>(async (lang) => {
    await updateWalletProperty(storage, wallet, { lang });
    await client.invalidateQueries([AppKey.account]);
  });
};
