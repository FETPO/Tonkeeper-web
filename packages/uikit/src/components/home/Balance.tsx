import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { AccountRepr } from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import BigNumber from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useFormattedPrice } from '../../hooks/balance';
import { getCoinPrice } from '../../hooks/useFiatRate';
import { Body2, Title } from '../Text';

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
`;

const Body = styled(Body2)`
  color: ${(props) => props.theme.textSecondary};
`;
const Error = styled.div`
  height: 30px;
`;

export const Balance: FC<{
  address: string;
  currency: FiatCurrencies;
  info?: AccountRepr | undefined;
  error?: Error | null;
  stock?: TonendpointStock | undefined;
}> = ({ address, currency, info, error, stock }) => {
  const total = useMemo(() => {
    if (!info?.balance || !stock) return undefined;
    return new BigNumber(info.balance)
      .multipliedBy(getCoinPrice(stock.today, currency))
      .toFixed(0);
  }, [info?.balance, stock, currency]);

  const balance = useFormattedPrice(currency, total);

  return (
    <Block>
      <Error>{error && error.message}</Error>
      <Title>{balance}</Title>
      <Body>{toShortAddress(address)}</Body>
    </Block>
  );
};
