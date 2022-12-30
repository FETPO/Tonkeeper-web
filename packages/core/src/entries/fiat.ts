export enum FiatCurrencies {
  USD = 'USD',
  EUR = 'EUR',
  RUB = 'RUB',
  GBP = 'GBP',
  CHF = 'CHF',
  CNY = 'CNY',
  KRW = 'KRW',
  IDR = 'IDR',
  INR = 'INR',
  JPY = 'JPY',
}

export type FiatCurrency = typeof FiatCurrencies[keyof typeof FiatCurrencies];

export interface CurrencyState {
  numberFormat: string;
  symbol: string;
  side: 'start' | 'end';
}

export const FiatCurrencySymbolsConfig: Record<FiatCurrency, CurrencyState> = {
  [FiatCurrencies.USD]: {
    numberFormat: 'en-US',
    symbol: '$',
    side: 'start',
  },
  [FiatCurrencies.EUR]: {
    numberFormat: 'de-DE',
    symbol: '€',
    side: 'start',
  },
  [FiatCurrencies.RUB]: {
    numberFormat: 'en-US',
    symbol: '₽',
    side: 'end',
  },
  [FiatCurrencies.GBP]: {
    numberFormat: 'en-GB',
    symbol: '£',
    side: 'start',
  },
  [FiatCurrencies.CHF]: {
    numberFormat: 'en-US',
    symbol: '₣',
    side: 'start',
  },
  [FiatCurrencies.CNY]: {
    numberFormat: 'en-US',
    symbol: '¥',
    side: 'start',
  },
  [FiatCurrencies.KRW]: {
    numberFormat: 'en-US',
    symbol: '₩',
    side: 'start',
  },
  [FiatCurrencies.IDR]: {
    numberFormat: 'en-US',
    symbol: 'Rp',
    side: 'end',
  },
  [FiatCurrencies.INR]: {
    numberFormat: 'en-US',
    symbol: '₹',
    side: 'start',
  },
  [FiatCurrencies.JPY]: {
    numberFormat: 'ja-JP',
    symbol: '¥',
    side: 'start',
  },
};
