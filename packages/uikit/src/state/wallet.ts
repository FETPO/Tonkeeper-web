import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import {
  accountLogOutWallet,
  getAccountState,
} from '@tonkeeper/core/dist/service/accountService';
import {
  getWalletState,
  updateWalletProperty,
} from '@tonkeeper/core/dist/service/walletService';
import {
  AccountApi,
  AccountRepr,
  JettonApi,
  JettonBalance,
  JettonsBalances,
  WalletApi,
} from '@tonkeeper/core/dist/tonApi';
import { delay } from '@tonkeeper/core/dist/utils/common';
import BigNumber from 'bignumber.js';
import { useAppContext, useWalletContext } from '../hooks/appContext';
import { useStorage } from '../hooks/storage';
import { JettonKey, QueryKey } from '../libs/queryKey';

export const useActiveWallet = () => {
  const storage = useStorage();
  return useQuery<WalletState | null, Error>(
    [AppKey.account, AppKey.wallet],
    async () => {
      const account = await getAccountState(storage);
      if (!account.activePublicKey) return null;
      return await getWalletState(storage, account.activePublicKey);
    }
  );
};

export const useWalletState = (publicKey: string) => {
  const storage = useStorage();
  return useQuery<WalletState | null, Error>(
    [AppKey.account, AppKey.wallet, publicKey],
    () => getWalletState(storage, publicKey)
  );
};

export const useMutateLogOut = (publicKey: string, remove = false) => {
  const storage = useStorage();
  const client = useQueryClient();
  const { tonApi } = useAppContext();
  return useMutation<void, Error, void>(async () => {
    await accountLogOutWallet(storage, tonApi, publicKey, remove);
    await client.invalidateQueries([AppKey.account]);
  });
};

export const useMutateRenameWallet = (wallet: WalletState) => {
  const storage = useStorage();
  const client = useQueryClient();
  const { tonApi } = useAppContext();
  return useMutation<void, Error, string>(async (name) => {
    if (name.length <= 0) {
      throw new Error('Missing name');
    }

    await updateWalletProperty(tonApi, storage, wallet, { name });
    await client.invalidateQueries([AppKey.account]);
  });
};

export const useMutateWalletProperty = () => {
  const storage = useStorage();
  const wallet = useWalletContext();
  const client = useQueryClient();
  const { tonApi } = useAppContext();
  return useMutation<
    void,
    Error,
    Pick<
      WalletState,
      'name' | 'hiddenJettons' | 'orderJettons' | 'lang' | 'fiat'
    >
  >(async (props) => {
    await updateWalletProperty(tonApi, storage, wallet, props);
    await client.invalidateQueries([AppKey.account]);
  });
};

export const useWalletAddresses = () => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useQuery<string[], Error>(
    [wallet.publicKey, QueryKey.addresses],
    async () => {
      const { wallets } = await new WalletApi(tonApi).findWalletsByPubKey({
        publicKey: wallet.publicKey,
      });
      const result = wallets
        .filter((item) => item.balance > 0 || item.status === 'active')
        .map((wallet) => wallet.address);

      if (result.length > 0) {
        return result;
      } else {
        return [wallet.active.rawAddress];
      }
    }
  );
};

export const useWalletAccountInfo = (addresses?: string[]) => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useQuery<AccountRepr, Error>(
    [wallet.publicKey, QueryKey.info],
    async () => {
      await delay(1000);

      const { accounts } = await new AccountApi(tonApi).getBulkAccountInfo({
        addresses: addresses!,
      });

      const active = accounts.find(
        (item) => item.address.raw === wallet.active.rawAddress
      );

      if (!active) {
        return await new AccountApi(tonApi).getAccountInfo({
          account: wallet.active.rawAddress,
        });
      }

      return accounts.reduce((acc, item) => {
        if (acc !== item) {
          acc.balance = new BigNumber(acc.balance)
            .plus(item.balance)
            .toNumber();
        }
        return acc;
      }, active);
    },
    { enabled: addresses != undefined }
  );
};

export const useWalletJettonList = (addresses?: string[]) => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  const client = useQueryClient();
  return useQuery<JettonsBalances, Error>(
    [wallet.publicKey, QueryKey.jettons],
    async () => {
      const all = await Promise.all(
        (addresses ?? []).map((account) =>
          new JettonApi(tonApi).getJettonsBalances({
            account,
          })
        )
      );

      const balances = all.reduce((acc, item) => {
        item.balances.forEach((jetton) => {
          const index = acc.findIndex(
            (j) => j.jettonAddress === jetton.jettonAddress
          );
          if (index == -1) {
            acc.push(jetton);
          } else {
            acc[index].balance = new BigNumber(acc[index].balance)
              .plus(jetton.balance)
              .toString();
          }
        });
        return acc;
      }, [] as JettonBalance[]);

      balances.forEach((item) => {
        client.setQueryData(
          [
            wallet.publicKey,
            QueryKey.jettons,
            JettonKey.balance,
            item.jettonAddress,
          ],
          item
        );
      });

      return { balances };
    },
    { enabled: addresses != undefined }
  );
};
