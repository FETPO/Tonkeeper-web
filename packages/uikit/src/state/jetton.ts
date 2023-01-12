import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { updateWalletProperty } from '@tonkeeper/core/dist/service/walletService';
import {
  AccountEvents,
  JettonApi,
  JettonBalance,
  JettonInfo,
  JettonsBalances,
} from '@tonkeeper/core/dist/tonApi';
import { getActiveWalletJetton } from '@tonkeeper/core/dist/tonApiExtended/walletApi';
import { delay } from '@tonkeeper/core/dist/utils/common';
import { useMemo } from 'react';
import { useAppContext, useWalletContext } from '../hooks/appContext';
import { useStorage } from '../hooks/storage';
import { JettonKey, QueryKey } from '../libs/queryKey';

export const useJettonInfo = (jettonAddress: string) => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useQuery<JettonInfo, Error>(
    [wallet.active.rawAddress, QueryKey.jettons, JettonKey.info, jettonAddress],
    async () => {
      await delay(1000);

      const result = await new JettonApi(tonApi).getJettonInfo({
        account: jettonAddress,
      });
      return result;
    }
  );
};

export const useJettonHistory = (walletAddress: string) => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useQuery<AccountEvents, Error>(
    [
      wallet.active.rawAddress,
      QueryKey.jettons,
      JettonKey.history,
      walletAddress,
    ],
    async () => {
      const result = await new JettonApi(tonApi).getJettonHistory({
        account: walletAddress,
        limit: 100,
      });
      return result;
    }
  );
};

export const useJettonBalance = (jettonAddress: string) => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useQuery<JettonBalance, Error>(
    [wallet.publicKey, QueryKey.jettons, JettonKey.balance, jettonAddress],
    async () => {
      const result = await getActiveWalletJetton(tonApi, wallet);

      const balance = result.balances.find(
        (item) => item.jettonAddress === jettonAddress
      );
      if (!balance) {
        throw new Error('Missing jetton balance');
      }
      return balance;
    }
  );
};

export const useToggleJettonMutation = () => {
  const storage = useStorage();
  const client = useQueryClient();
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useMutation<void, Error, string>(async (jettonAddress) => {
    const hiddenJettons = wallet.hiddenJettons ?? [];
    const updated = hiddenJettons.includes(jettonAddress)
      ? hiddenJettons.filter((item) => item !== jettonAddress)
      : hiddenJettons.concat([jettonAddress]);

    await updateWalletProperty(tonApi, storage, wallet, {
      hiddenJettons: updated,
    });

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
  shownJettons: string[] | undefined,
  jettons: JettonBalance[]
) => {
  return jettons.filter((jetton) => {
    if (jetton.verification == 'whitelist') {
      return hiddenJettons
        ? !hiddenJettons.includes(jetton.jettonAddress)
        : true;
    } else {
      return shownJettons ? shownJettons.includes(jetton.jettonAddress) : false;
    }
  });
};

export const useUserJettonList = (jettons: JettonsBalances) => {
  const { hiddenJettons, orderJettons, shownJettons } = useWalletContext();

  return useMemo(() => {
    const order = sortJettons(orderJettons, jettons.balances);
    const hide = hideJettons(hiddenJettons, shownJettons, order);

    return {
      balances: hide,
    };
  }, [jettons, hiddenJettons, orderJettons]);
};
