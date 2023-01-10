import { FiatCurrencySymbolsConfig } from '@tonkeeper/core/dist/entries/fiat';
import {
  AccountRepr,
  JettonBalance,
  JettonsBalances,
} from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import BigNumber from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../hooks/appContext';
import { formatAmountValue, useFormattedPrice } from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { getCoinPrice } from '../../hooks/useFiatRate';
import { ToncoinIcon } from '../Icon';
import { ColumnText } from '../Layout';
import { ListBlock, ListItem, ListItemPayload } from '../List';
import { Body2, Label1 } from '../Text';

export interface AssetProps {
  stock: TonendpointStock | undefined;
  info: AccountRepr | undefined;
  jettons: JettonsBalances | undefined;
}

const Description = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Body = styled(Body2)`
  color: ${(props) => props.theme.textSecondary};
`;

const Symbol = styled(Label1)`
  color: ${(props) => props.theme.textSecondary};
`;

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
    (amount: number | string, decimals: number = 9) => {
      const value = formatAmountValue(String(amount), decimals);
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

export const TonAsset: FC<{
  info: AccountRepr | undefined;
  stock: TonendpointStock | undefined;
}> = ({ info, stock }) => {
  const { t } = useTranslation();
  const { fiat } = useAppContext();

  const price = useMemo(() => {
    if (!stock) return new BigNumber(0);
    return getCoinPrice(stock.today, fiat);
  }, [stock]);

  const format = useFormatCoinValue();

  const balance = (info?.balance && String(format(info?.balance))) || '-';

  const fiatPrice = useFormattedPrice(
    fiat,
    price.multipliedBy(1000).toFixed(0),
    3
  );

  const fiatAmount = useFormattedPrice(
    fiat,
    price.multipliedBy(info?.balance ?? 0).toFixed(0)
  );

  return (
    <ListItem>
      <ListItemPayload>
        <Description>
          <ToncoinIcon />
          <Text>
            <Label1>{t('Toncoin')}</Label1>
            <Body>{fiatPrice}</Body>
          </Text>
        </Description>
        <ColumnText text={balance} secondary={fiatAmount} right />
      </ListItemPayload>
    </ListItem>
  );
};

const Logo = styled.img`
  width: 44px;
  height: 44px;
  border-radius: ${(props) => props.theme.cornerFull};
`;

export const JettonAsset: FC<{ jetton: JettonBalance }> = ({ jetton }) => {
  const { t } = useTranslation();
  const { fiat } = useAppContext();

  const format = useFormatCoinValue();

  const balance = jetton
    ? format(jetton.balance, jetton.metadata?.decimals)
    : '-';

  return (
    <ListItem>
      <ListItemPayload>
        <Description>
          <Logo src={jetton.metadata?.image} />
          <Label1>
            {jetton.metadata?.name ?? t('Unknown_COIN')}{' '}
            <Symbol>{jetton.metadata?.symbol}</Symbol>
          </Label1>
        </Description>
        <Label1>{balance}</Label1>
      </ListItemPayload>
    </ListItem>
  );
};

export const Assets: FC<AssetProps> = ({ info, jettons, stock }) => {
  return (
    <ListBlock>
      <TonAsset info={info} stock={stock} />
      {(jettons?.balances ?? []).map((jetton) => (
        <JettonAsset key={jetton.jettonAddress} jetton={jetton} />
      ))}
    </ListBlock>
  );
};
