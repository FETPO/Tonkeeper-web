import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { useStorage } from '../hooks/storage';

export const useFiatCurrency = () => {
  const storage = useStorage();
  return useQuery<FiatCurrencies, Error>([AppKey.fiat], async () => {
    const state = await storage.get<FiatCurrencies>(AppKey.fiat);
    return state ?? FiatCurrencies.USD;
  });
};

export const useMutateFiatCurrency = () => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, FiatCurrencies>(async (state) => {
    await storage.set(AppKey.fiat, state);
    client.setQueryData([AppKey.fiat], state);
  });
};
