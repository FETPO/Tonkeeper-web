import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { updateWallet } from '@tonkeeper/core/dist/service/accountService';
import {
  JettonApi,
  JettonBalance,
  JettonsBalances,
} from '@tonkeeper/core/dist/tonApi';
import { useMemo } from 'react';
import { useAppContext, useWalletContext } from '../hooks/appContext';
import { useStorage } from '../hooks/storage';
import { getAccountState } from './account';

export const useJettonsInfo = () => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useQuery<JettonsBalances, Error>(
    [wallet.address, AppKey.jettons],
    async () => {
      const result = await new JettonApi(tonApi).getJettonsBalances({
        account: wallet.address,
      });

      return {
        balances: result.balances.filter(
          (item) => item.verification === 'whitelist'
        ),
      };
    }
  );
};

export const useOrderJettonMutation = () => {
  const storage = useStorage();
  const client = useQueryClient();
  const wallet = useWalletContext();

  return useMutation<void, Error, string[]>(async (orderJettons) => {
    let account = await getAccountState(storage);

    account = updateWallet(account, {
      ...wallet,
      orderJettons,
    });

    await storage.set(AppKey.account, account);
    await client.invalidateQueries([AppKey.account]);
  });
};

export const useToggleJettonMutation = () => {
  const storage = useStorage();
  const client = useQueryClient();
  const wallet = useWalletContext();

  return useMutation<void, Error, string>(async (jettonAddress) => {
    let account = await getAccountState(storage);

    const hiddenJettons = wallet.hiddenJettons ?? [];
    if (hiddenJettons.includes(jettonAddress)) {
      account = updateWallet(account, {
        ...wallet,
        hiddenJettons: hiddenJettons.filter((item) => item !== jettonAddress),
      });
    } else {
      account = updateWallet(account, {
        ...wallet,
        hiddenJettons: hiddenJettons.concat([jettonAddress]),
      });
    }

    await storage.set(AppKey.account, account);
    await client.invalidateQueries([AppKey.account]);
  });
};

export const sortJettons = (
  orderJettons: string[] | undefined,
  jettons: JettonBalance[]
) => {
  if (!orderJettons) return jettons;
  return jettons.sort(
    (a, b) =>
      orderJettons.indexOf(a.jettonAddress) -
      orderJettons.indexOf(b.jettonAddress)
  );
};

export const hideJettons = (
  hiddenJettons: string[] | undefined,
  jettons: JettonBalance[]
) => {
  if (!hiddenJettons || hiddenJettons.length === 0) return jettons;
  return jettons.filter((item) => !hiddenJettons.includes(item.jettonAddress));
};

export const useUserJettonList = () => {
  const { data: jettons } = useJettonsInfo();
  const { hiddenJettons, orderJettons } = useWalletContext();

  return useMemo(() => {
    if (!jettons) return jettons;

    const order = sortJettons(orderJettons, jettons.balances);
    const hide = hideJettons(hiddenJettons, order);

    return {
      balances: hide,
    };
  }, [jettons, hiddenJettons, orderJettons]);
};
