import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import {
  accountLogOutWallet,
  getAccountState,
} from '@tonkeeper/core/dist/service/accountService';
import {
  getWalletState,
  updateWalletProperty,
} from '@tonkeeper/core/dist/service/walletService';
import {
  AccountRepr,
  JettonsBalances,
  NFTApi,
  NftItemsRepr,
} from '@tonkeeper/core/dist/tonApi';
import {
  getActiveWalletJetton,
  getWalletActiveAccountInfo,
  getWalletActiveAddresses,
} from '@tonkeeper/core/dist/tonApiExtended/walletApi';
import { delay } from '@tonkeeper/core/dist/utils/common';
import { useAppContext, useWalletContext } from '../hooks/appContext';
import { useStorage } from '../hooks/storage';
import { JettonKey, QueryKey } from '../libs/queryKey';

export const useActiveWallet = () => {
  const storage = useStorage();
  return useQuery<WalletState | null, Error>(
    [QueryKey.account, QueryKey.wallet],
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
    [QueryKey.account, QueryKey.wallet, publicKey],
    () => getWalletState(storage, publicKey)
  );
};

export const useMutateLogOut = (publicKey: string, remove = false) => {
  const storage = useStorage();
  const client = useQueryClient();
  const { tonApi } = useAppContext();
  return useMutation<void, Error, void>(async () => {
    await accountLogOutWallet(storage, tonApi, publicKey, remove);
    await client.invalidateQueries([QueryKey.account]);
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
    await client.invalidateQueries([QueryKey.account]);
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
      'name' | 'hiddenJettons' | 'orderJettons' | 'lang' | 'fiat' | 'network'
    >
  >(async (props) => {
    await updateWalletProperty(tonApi, storage, wallet, props);
    await client.invalidateQueries([QueryKey.account]);
  });
};

export const useWalletAddresses = () => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useQuery<string[], Error>([wallet.publicKey, QueryKey.addresses], () =>
    getWalletActiveAddresses(tonApi, wallet)
  );
};

export const useWalletAccountInfo = (addresses?: string[]) => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useQuery<AccountRepr, Error>(
    [wallet.publicKey, QueryKey.info],
    async () => {
      await delay(1000);

      return getWalletActiveAccountInfo(tonApi, wallet, addresses);
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
      const result = await getActiveWalletJetton(tonApi, wallet, addresses);

      result.balances.forEach((item) => {
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

      return result;
    },
    { enabled: addresses != undefined }
  );
};

export const useWalletNftList = (addresses?: string[]) => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();

  return useQuery<NftItemsRepr, Error>(
    [wallet.publicKey, QueryKey.nft],
    async () => {
      const items = await Promise.all(
        (addresses ?? []).map(async (address) => {
          const result = await new NFTApi(tonApi).searchNFTItems({
            owner: address,
            offset: 0,
            limit: 1000,
          });
          return result.nftItems;
        })
      );

      return { nftItems: items.flat() };
    },
    { enabled: addresses != null }
  );
};
