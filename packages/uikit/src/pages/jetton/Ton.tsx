import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { AccountRepr } from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import BigNumber from 'bignumber.js';
import React, { useMemo } from 'react';
import { ActionsRow } from '../../components/home/Actions';
import { HomeActions } from '../../components/home/TonActions';
import { CoinInfo, CoinInfoSkeleton } from '../../components/jettons/Info';
import { SkeletonAction, SkeletonSubHeader } from '../../components/Sceleton';
import { SubHeader } from '../../components/SubHeader';
import { useAppContext } from '../../hooks/appContext';
import {
  formatDecimals,
  formatFiatCurrency,
  getTonCoinStockPrice,
  useFormatCoinValue,
} from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { useTonenpointStock } from '../../state/tonendpoint';
import { useWalletAccountInfo } from '../../state/wallet';

export const TonPageSkeleton = () => {
  return (
    <div>
      <SkeletonSubHeader />
      <CoinInfoSkeleton />
      <ActionsRow>
        <SkeletonAction />
        <SkeletonAction />
        <SkeletonAction />
        <SkeletonAction />
      </ActionsRow>
    </div>
  );
};

const useBalanceValue = (
  info: AccountRepr | undefined,
  stock: TonendpointStock | undefined,
  fiat: FiatCurrencies
) => {
  return useMemo(() => {
    if (!info || !stock) {
      return formatFiatCurrency(fiat, 0);
    }

    const ton = new BigNumber(info.balance).multipliedBy(
      formatDecimals(getTonCoinStockPrice(stock.today, fiat))
    );
    return formatFiatCurrency(fiat, ton);
  }, [info, stock]);
};

export const TonPage = () => {
  const { fiat, tonendpoint } = useAppContext();
  const { data: stock } = useTonenpointStock(tonendpoint);
  const { data: info } = useWalletAccountInfo();

  const format = useFormatCoinValue();
  const amount = info ? format(info.balance) : '0';

  const total = useBalanceValue(info, stock, fiat);

  const { t } = useTranslation();

  if (!stock || !info) {
    return <TonPageSkeleton />;
  }

  return (
    <div>
      <SubHeader title={t('Toncoin')} />
      <CoinInfo
        amount={amount}
        symbol="TON"
        price={total}
        description={t('Ton_page_description')}
        image="/img/toncoin.svg"
      />
      <HomeActions />
    </div>
  );
};
