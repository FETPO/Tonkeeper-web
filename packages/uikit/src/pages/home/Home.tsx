import {
  AccountRepr,
  JettonsBalances,
  NftItemsRepr,
} from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import React, { FC } from 'react';
import { Action, ActionsRow } from '../../components/home/Actions';
import { Balance } from '../../components/home/Balance';
import { BuyAction, SellAction } from '../../components/home/BuyAction';
import { CompactView } from '../../components/home/CompactView';
import { SendIcon } from '../../components/home/HomeIcons';
import { ReceiveAction } from '../../components/home/ReceiveAction';
import { TabsView } from '../../components/home/TabsView';
import { SkeletonAction, SkeletonList } from '../../components/Sceleton';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { useUserJettonList } from '../../state/jetton';
import {
  useTonenpointFiatMethods,
  useTonenpointStock,
} from '../../state/tonendpoint';
import {
  useWalletAccountInfo,
  useWalletAddresses,
  useWalletJettonList,
  useWalletNftList,
} from '../../state/wallet';

export const HomeActions = () => {
  const { t } = useTranslation();
  const { tonendpoint } = useAppContext();
  const { data: methods } = useTonenpointFiatMethods(tonendpoint);

  const buy = methods && methods.categories[0];
  const sell = methods && methods.categories[1];

  return (
    <ActionsRow>
      <BuyAction buy={buy} />
      <Action icon={<SendIcon />} title={t('Send')} action={() => null} />
      <ReceiveAction />
      <SellAction sell={sell} />
    </ActionsRow>
  );
};

export const HomeSkeleton = () => {
  const wallet = useWalletContext();
  const { fiat } = useAppContext();
  return (
    <>
      <Balance address={wallet.active.friendlyAddress} currency={fiat} />
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

  const { data: addresses } = useWalletAddresses();
  const { data: stock } = useTonenpointStock(tonendpoint);

  const { data: info, error } = useWalletAccountInfo(addresses);
  const { data: jettons } = useWalletJettonList(addresses);
  const { data: nfts } = useWalletNftList(addresses);

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
