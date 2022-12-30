import {
  FiatCurrencies,
  FiatCurrencySymbolsConfig,
} from '@tonkeeper/core/dist/entries/fiat';
import { AccountRepr } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
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

const toShortAddress = (address: string, length = 4): string => {
  return address.slice(0, length) + '....' + address.slice(-length);
};

export const Balance: FC<{
  address: string;
  currency: FiatCurrencies;
  info?: AccountRepr | undefined;
  error?: Error | null;
}> = ({ address, currency, info, error }) => {
  const balance = useMemo(() => {
    const config = FiatCurrencySymbolsConfig[currency];
    console.log(config, currency);
    const balanceFormat = new Intl.NumberFormat(config.numberFormat, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      style: 'currency',
      currency: currency,
    });

    return info?.balance !== undefined ? balanceFormat.format(123123.123) : '-';
  }, [info, currency]);

  return (
    <Block>
      <Error>{error && error.message}</Error>
      <Title>{balance}</Title>
      <Body>{toShortAddress(address)}</Body>
    </Block>
  );
};
