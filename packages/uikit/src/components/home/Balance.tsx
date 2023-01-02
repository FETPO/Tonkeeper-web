import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { AccountRepr } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useFormattedPrice } from '../../hooks/balance';
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
}> = ({ address, currency, info, error }) => {
  const balance = useFormattedPrice(currency, info?.balance);

  return (
    <Block>
      <Error>{error && error.message}</Error>
      <Title>{balance}</Title>
      <Body>{toShortAddress(address)}</Body>
    </Block>
  );
};
