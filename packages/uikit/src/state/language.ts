import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  defaultLanguage,
  Language,
} from '@tonkeeper/core/dist/entries/language';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { useStore } from '../hooks/storage';

export const useLanguage = () => {
  const storage = useStore();
  return useQuery([AppKey.lang], async () => {
    const lang = await storage.get<Language>(AppKey.lang);
    return lang ?? defaultLanguage;
  });
};

export const useMutateLanguage = () => {
  const storage = useStore();
  const client = useQueryClient();
  return useMutation<void, Error, Language>(async (language) => {
    await storage.set(AppKey.lang, language);
    await client.invalidateQueries([AppKey.lang]);
  });
};
