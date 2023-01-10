//import BigNumber from 'bignumber.js';
import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

// export function getRate(
//   rates: RatesMap,
//   currency: CryptoCurrency,
//   fiatCurrency: string,
// ): number {
//   let result = 0;

//   if (
//     [CryptoCurrencies.TonLocked, CryptoCurrencies.TonRestricted].indexOf(currency) > -1
//   ) {
//     currency = CryptoCurrencies.Ton;
//   }

//   fiatCurrency = fiatCurrency.toUpperCase();
//   const currencyUpper = currency?.toUpperCase();
//   if (currencyUpper === CryptoCurrencies.Btc.toUpperCase() && rates[fiatCurrency]) {
//     result = +rates[fiatCurrency];
//   } else if (rates[currencyUpper]) {
//     const btcPrice = rates[currencyUpper];
//     const btcInFiat = rates[fiatCurrency];

//     result = new BigNumber(btcInFiat).div(btcPrice).toNumber();
//   }

//   return result;
// }

export const getCoinPrice = (
  rates: { [key: string]: string },
  currency: FiatCurrencies
): BigNumber => {
  const btcPrice = rates['TON'];
  const btcInFiat = rates[currency] ?? rates[FiatCurrencies.USD];

  return new BigNumber(btcInFiat).div(new BigNumber(btcPrice));
};

export function useFiatRate(currency: FiatCurrencies, stock: TonendpointStock) {
  return useMemo(() => {
    return {
      today: getCoinPrice(stock.today, currency),
      yesterday: getCoinPrice(stock.yesterday, currency),
    };
  }, [stock, currency]);
}
