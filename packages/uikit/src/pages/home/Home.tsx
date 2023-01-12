import React from 'react';
import { Action, ActionsRow } from '../../components/home/Actions';
import { Balance } from '../../components/home/Balance';
import { BuyAction, SellAction } from '../../components/home/BuyAction';
import { CompactView } from '../../components/home/CompactView';
import { SendIcon } from '../../components/home/HomeIcons';
import { ReceiveAction } from '../../components/home/ReceiveAction';
import { SkeletonAction, SkeletonList } from '../../components/Sceleton';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { useUserJettonList } from '../../state/jetton';
import { useNftInfo } from '../../state/nft';
import {
  useTonenpointFiatMethods,
  useTonenpointStock,
} from '../../state/tonendpoint';
import {
  useWalletAccountInfo,
  useWalletAddresses,
  useWalletJettonList,
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
      <Balance address={wallet.active.rawAddress} currency={fiat} />
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

export const Home = () => {
  const wallet = useWalletContext();

  const { fiat, tonendpoint } = useAppContext();

  const { data: addresses } = useWalletAddresses();
  const { data: stock } = useTonenpointStock(tonendpoint);
  const { data: info, error } = useWalletAccountInfo(addresses);
  const { data: jettons } = useWalletJettonList(addresses);

  const { data: nfts } = useNftInfo();

  const filtered = useUserJettonList(jettons);

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
      />
      <HomeActions />
      <CompactView info={info} jettons={jettons} nfts={nfts} stock={stock} />
    </>
  );
};
