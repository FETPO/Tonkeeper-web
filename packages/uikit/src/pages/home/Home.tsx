import {
  AccountRepr,
  JettonsBalances,
  NftItemsRepr,
} from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import React, { FC } from 'react';
import { ActionsRow } from '../../components/home/Actions';
import { Balance, BalanceSkeleton } from '../../components/home/Balance';
import { CompactView } from '../../components/home/CompactView';
import { TabsView } from '../../components/home/TabsView';
import { HomeActions } from '../../components/home/TonActions';
import { SkeletonAction, SkeletonList } from '../../components/Sceleton';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useUserJettonList } from '../../state/jetton';
import { useTonenpointStock } from '../../state/tonendpoint';
import {
  useWalletAccountInfo,
  useWalletJettonList,
  useWalletNftList,
} from '../../state/wallet';

export const HomeSkeleton = () => {
  return (
    <>
      <BalanceSkeleton />
      <ActionsRow>
        <SkeletonAction />
        <SkeletonAction />
        <SkeletonAction />
        <SkeletonAction />
      </ActionsRow>
      <SkeletonList size={5} />
    </>
  );
};

const HomeAssets: FC<{
  stock: TonendpointStock;
  jettons: JettonsBalances;
  info: AccountRepr;
  nfts: NftItemsRepr;
}> = ({ stock, jettons, info, nfts }) => {
  const filtered = useUserJettonList(jettons);

  if (filtered.balances.length + nfts.nftItems.length < 10) {
    return (
      <CompactView info={info} jettons={filtered} nfts={nfts} stock={stock} />
    );
  } else {
    return (
      <TabsView info={info} jettons={filtered} nfts={nfts} stock={stock} />
    );
  }
};

export const Home = () => {
  const wallet = useWalletContext();

  const { fiat, tonendpoint } = useAppContext();

  const { data: stock } = useTonenpointStock(tonendpoint);

  const { data: info, error } = useWalletAccountInfo();
  const { data: jettons } = useWalletJettonList();
  const { data: nfts } = useWalletNftList();

  if (!stock || !nfts || !jettons || !info) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <Balance
        address={wallet.active.friendlyAddress}
        currency={fiat}
        info={info}
        error={error}
        stock={stock}
        jettons={jettons}
      />
      <HomeActions />
      <HomeAssets info={info} jettons={jettons} nfts={nfts} stock={stock} />
    </>
  );
};
