import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { defaultNetwork, Network } from '@tonkeeper/core/dist/entries/network';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { useStorage } from '../hooks/storage';

export const useNetwork = () => {
  const storage = useStorage();
  return useQuery([AppKey.network], async () => {
    const network = await storage.get<Network>(AppKey.network);
    return network ?? defaultNetwork;
  });
};

export const useMutateNetwork = () => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, Network>(async (network) => {
    await storage.set(AppKey.network, network);
    await client.invalidateQueries([AppKey.network]);
  });
};