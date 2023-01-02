import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { updateWallet } from '@tonkeeper/core/dist/service/accountService';
import { JettonApi, JettonsBalances } from '@tonkeeper/core/dist/tonApi';
import { useMemo } from 'react';
import { useAppContext, useWalletContext } from '../hooks/appContext';
import { useStorage } from '../hooks/storage';
import { getAccountState } from './account';

export const useJettonsInfo = () => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useQuery<JettonsBalances, Error>(
    [wallet.address, AppKey.jettions],
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

export const useUserJettonList = () => {
  const { data: jettons } = useJettonsInfo();
  const { hiddenJettons } = useWalletContext();

  return useMemo(() => {
    if (!jettons) return jettons;
    if (!hiddenJettons || hiddenJettons.length === 0) return jettons;

    return {
      balances: jettons.balances.filter(
        (item) => !hiddenJettons.includes(item.jettonAddress)
      ),
    };
  }, [jettons, hiddenJettons]);
};
