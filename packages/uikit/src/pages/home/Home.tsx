import { useQuery } from '@tanstack/react-query';
import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import {
  AccountApi,
  AccountRepr,
  Configuration,
} from '@tonkeeper/core/dist/tonApi';
import React from 'react';
import { Action, ActionsRow } from '../../components/home/Actions';
import { Balance } from '../../components/home/Balance';
import { BuyAction } from '../../components/home/BuyAction';
import { CompactView } from '../../components/home/CompactView';
import {
  ReceiveIcon,
  SellIcon,
  SendIcon,
} from '../../components/home/HomeIcons';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { useUserJettonList } from '../../state/jetton';
import { useNftInfo } from '../../state/nft';

const useAccountInfo = (tonApi: Configuration, wallet: WalletState) => {
  return useQuery<AccountRepr, Error>(
    [wallet.address, AppKey.balance],
    async () => {
      return await new AccountApi(tonApi).getAccountInfo({
        account: wallet.address,
      });
    }
  );
};

export const Home = () => {
  const { t } = useTranslation();
  const wallet = useWalletContext();
  const { tonApi, fiat } = useAppContext();

  const { data: info, error } = useAccountInfo(tonApi, wallet);
  const jettons = useUserJettonList();
  const { data: nfts } = useNftInfo();

  return (
    <>
      <Balance
        address={wallet.address}
        info={info}
        error={error}
        currency={fiat}
      />
      <ActionsRow>
        <BuyAction />
        <Action icon={<SendIcon />} title={t('Send')} action={() => null} />
        <Action
          icon={<ReceiveIcon />}
          title={t('Receive')}
          action={() => null}
        />
        <Action icon={<SellIcon />} title={t('Sell')} action={() => null} />
      </ActionsRow>
      <CompactView info={info} jettons={jettons} nfts={nfts} />
    </>
  );
};
