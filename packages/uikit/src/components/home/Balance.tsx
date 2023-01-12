import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { AccountRepr, JettonsBalances } from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import BigNumber from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useWalletContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
import {
  formatAmountValue,
  formatFiatPrice,
  getJettonStockAmount,
  getTonCoinStockPrice,
} from '../../hooks/balance';
import { useUserJettonList } from '../../state/jetton';
import { Body2, Title } from '../Text';

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
`;

const Body = styled(Body2)`
  color: ${(props) => props.theme.textSecondary};
  cursor: pointer;
`;
const Error = styled.div`
  height: 30px;
`;

const useBalanceValue = (
  info: AccountRepr | undefined,
  stock: TonendpointStock | undefined,
  jettons: JettonsBalances,
  currency: FiatCurrencies
) => {
  return useMemo(() => {
    if (!info || !stock) {
      return formatFiatPrice(currency, 0);
    }

    const ton = new BigNumber(info.balance).multipliedBy(
      formatAmountValue(getTonCoinStockPrice(stock.today, currency))
    );

    const all = jettons.balances.reduce((total, jetton) => {
      const amount = getJettonStockAmount(jetton, stock.today, currency);
      if (amount) {
        return total.plus(amount);
      } else {
        return total;
      }
    }, ton);

    return formatFiatPrice(currency, all);
  }, [info, stock, jettons, currency]);
};

export const Balance: FC<{
  address: string;
  currency: FiatCurrencies;
  info?: AccountRepr | undefined;
  error?: Error | null;
  stock?: TonendpointStock | undefined;
  jettons?: JettonsBalances | undefined;
}> = ({ address, currency, info, error, stock, jettons }) => {
  const sdk = useAppSdk();
  const wallet = useWalletContext();

  const filtered = useUserJettonList(jettons);
  const total = useBalanceValue(info, stock, filtered, currency);

  const onClick = useCallback(() => {
    sdk.copyToClipboard(wallet.active.friendlyAddress);
  }, [sdk, wallet]);

  return (
    <Block>
      <Error>{error && error.message}</Error>
      <Title onClick={onClick}>{total}</Title>
      <Body onClick={onClick}>{toShortAddress(address)}</Body>
    </Block>
  );
};
