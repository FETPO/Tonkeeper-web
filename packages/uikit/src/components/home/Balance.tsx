import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { AccountRepr } from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import BigNumber from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useWalletContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
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
  cursor: pointer;
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
  const sdk = useAppSdk();
  const wallet = useWalletContext();

  const total = useMemo(() => {
    if (!info?.balance || !stock) return undefined;
    return new BigNumber(info.balance)
      .multipliedBy(getCoinPrice(stock.today, currency))
      .toFixed(0);
  }, [info?.balance, stock, currency]);

  const balance = useFormattedPrice(currency, total);

  const onClick = useCallback(() => {
    sdk.copyToClipboard(wallet.active.friendlyAddress);
  }, [sdk, wallet]);
  return (
    <Block>
      <Error>{error && error.message}</Error>
      <Title onClick={onClick}>{balance}</Title>
      <Body onClick={onClick}>{toShortAddress(address)}</Body>
    </Block>
  );
};
