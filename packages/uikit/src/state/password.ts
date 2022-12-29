import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AuthState,
  defaultAuthState,
} from '@tonkeeper/core/dist/entries/password';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { useStorage } from '../hooks/storage';

export const useAuthState = () => {
  const storage = useStorage();
  return useQuery([AppKey.password], async () => {
    const auth = await storage.get<AuthState>(AppKey.password);
    return auth ?? defaultAuthState;
  });
};

export const useMutateAuthState = () => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, AuthState>(async (state) => {
    await storage.set(AppKey.password, { state });
    await client.invalidateQueries([AppKey.password]);
  });
};
