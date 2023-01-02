import {
  FiatCurrencies,
  FiatCurrencySymbolsConfig,
} from '@tonkeeper/core/dist/entries/fiat';
import BN from 'bn.js';
import { useMemo } from 'react';
const ethunit = require('ethjs-unit');

const map: Record<string, string> = {
  '1': 'wei',
  '1000': 'kwei',
  '1000000': 'mwei',
  '1000000000': 'gwei',
  '1000000000000': 'szabo',
  '1000000000000000': 'finney',
  '1000000000000000000': 'ether',
  '1000000000000000000000': 'kether',
  '1000000000000000000000000': 'mether',
  '1000000000000000000000000000': 'gether',
  '1000000000000000000000000000000': 'tether',
};

export const formatAmountValue = (
  amount: BN | string,
  decimals: number | string = 9
): number => {
  if (!BN.isBN(amount) && !(typeof amount === 'string')) {
    throw new Error(
      'Please pass numbers as strings or BN objects to avoid precision errors.'
    );
  }

  const format = map[Math.pow(10, parseInt(String(decimals))).toString()];
  if (!format) {
    throw new Error('Unexpected format');
  }

  return parseFloat(ethunit.fromWei(amount, format));
};

export const parseCoinValue = (
  amount: string | BN,
  decimals: number | string = 9
): BN => {
  if (!BN.isBN(amount) && !(typeof amount === 'string')) {
    throw new Error(
      'Please pass numbers as strings or BN objects to avoid precision errors.'
    );
  }

  const format = map[Math.pow(10, parseInt(String(decimals))).toString()];
  if (!format) {
    throw new Error('Unexpected format');
  }
  if (!BN.isBN(amount) && !(typeof amount === 'string')) {
    throw new Error('Unexpected format');
  }
  return ethunit.toWei(amount, format);
};

export const useCoinBalance = (
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

    return balance !== undefined
      ? balanceFormat.format(formatAmountValue(String(balance), decimals))
      : '-';
  }, [currency, balance, decimals]);
};

export const useFormattedBalance = (
  currency: FiatCurrencies,
  balance?: number | string,
  decimals?: number | string
) => {
  return useMemo(() => {
    const config = FiatCurrencySymbolsConfig[currency];
    const balanceFormat = new Intl.NumberFormat(config.numberFormat, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return balance !== undefined
      ? balanceFormat.format(formatAmountValue(String(balance), decimals))
      : '-';
  }, [currency, balance, decimals]);
};

export const useFormattedPrice = (
  currency: FiatCurrencies,
  balance?: number | string,
  decimals?: number | string
) => {
  return useMemo(() => {
    const config = FiatCurrencySymbolsConfig[currency];
    const balanceFormat = new Intl.NumberFormat(config.numberFormat, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      style: 'currency',
      currency: currency,
    });

    return balance !== undefined
      ? balanceFormat.format(formatAmountValue(String(balance), decimals))
      : '-';
  }, [currency, balance, decimals]);
};
