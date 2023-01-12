import {
  FiatCurrencies,
  FiatCurrencySymbolsConfig,
} from '@tonkeeper/core/dist/entries/fiat';
import { JettonBalance } from '@tonkeeper/core/dist/tonApi';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { useAppContext } from './appContext';

export const formatAmountValue = (
  amount: BigNumber.Value,
  decimals: number = 9
): number => {
  return new BigNumber(amount).div(Math.pow(10, decimals)).toNumber();
};

export const useCoinFullBalance = (
  currency: FiatCurrencies,
  balance?: number | string,
  decimals?: number
) => {
  return useMemo(() => {
    const config = FiatCurrencySymbolsConfig[currency];
    const balanceFormat = new Intl.NumberFormat(config.numberFormat, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals ?? 9,
    });

    if (!balance) return '0';

    return balanceFormat.format(
      new BigNumber(balance).div(Math.pow(10, decimals ?? 9)).toNumber()
    );
  }, [currency, balance, decimals]);
};

export const useFormatCoinValue = () => {
  const { fiat } = useAppContext();

  const formats = useMemo(
    () => [
      new Intl.NumberFormat(FiatCurrencySymbolsConfig[fiat].numberFormat, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
      new Intl.NumberFormat(FiatCurrencySymbolsConfig[fiat].numberFormat, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      }),
    ],
    [fiat]
  );

  return useCallback(
    (amount: number | string, decimals?: number) => {
      if (amount == 0) return '0';

      const value = formatAmountValue(amount, decimals);
      const [common, secondary] = formats;
      let formatted = common.format(value);
      if (formatted != '0' && formatted != '0.01') {
        return formatted;
      }

      formatted = secondary.format(value);
      if (formatted != '0') {
        return formatted;
      }

      return '<0.0001';
    },
    [fiat, formats]
  );
};

export const getTonCoinStockPrice = (
  rates: { [key: string]: string },
  currency: FiatCurrencies
): BigNumber => {
  const btcPrice = rates['TON'];
  const btcInFiat = rates[currency] ?? rates[FiatCurrencies.USD];

  return new BigNumber(btcInFiat).div(new BigNumber(btcPrice));
};

export const getJettonStockAmount = (
  jetton: JettonBalance,
  rates: { [key: string]: string },
  currency: FiatCurrencies
) => {
  if (jetton.verification !== 'whitelist') return null;
  if (!jetton.metadata?.symbol) return null;
  const price = getStockPrice(jetton.metadata?.symbol, rates, currency);
  if (!price) return null;
  const balance = formatAmountValue(jetton.balance, jetton.metadata?.decimals);
  return price.multipliedBy(balance);
};

export const getStockPrice = (
  coin: string,
  rates: { [key: string]: string },
  currency: FiatCurrencies
): BigNumber | null => {
  const btcPrice = rates[coin];
  const btcInFiat = rates[currency];

  if (!btcPrice || !btcInFiat) return null;

  return new BigNumber(btcInFiat).div(new BigNumber(btcPrice));
};

const toFiatCurrencyFormat = (currency: FiatCurrencies) => {
  const config = FiatCurrencySymbolsConfig[currency];
  return new Intl.NumberFormat(config.numberFormat, {
    minimumFractionDigits: 0,
    maximumFractionDigits: config.maximumFractionDigits,
    style: 'currency',
    currency: currency,
  });
};

export const formatFiatPrice = (
  currency: FiatCurrencies,
  balance: BigNumber.Value
) => {
  const balanceFormat = toFiatCurrencyFormat(currency);
  return balanceFormat.format(new BigNumber(balance).toNumber());
};

export const useFormattedPrice = (
  currency: FiatCurrencies,
  balance?: number | string,
  decimals?: number
) => {
  return useMemo(() => {
    if (!balance) return '0';
    const balanceFormat = toFiatCurrencyFormat(currency);
    return balanceFormat.format(formatAmountValue(balance, decimals));
  }, [currency, balance, decimals]);
};
