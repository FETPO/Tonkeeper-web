import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import {
  AccountRepr,
  JettonBalance,
  JettonsBalances,
} from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import BigNumber from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAppContext } from '../../hooks/appContext';
import {
  formatAmountValue,
  formatFiatPrice,
  getStockPrice,
  useFormatCoinValue,
  useFormattedPrice,
} from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { getCoinPrice } from '../../hooks/useFiatRate';
import { AppRoute, SettingsRoute } from '../../libs/routes';
import { ToncoinIcon } from '../Icon';
import { ColumnText } from '../Layout';
import { ListBlock, ListItem, ListItemPayload } from '../List';
import { Label1, Label2 } from '../Text';

export interface AssetProps {
  stock: TonendpointStock;
  info: AccountRepr;
  jettons: JettonsBalances;
}

const Description = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Symbol = styled(Label1)`
  color: ${(props) => props.theme.textSecondary};
`;

const DeltaColor = styled.span<{ positive: boolean }>`
  margin-left: 0.5rem;
  
  ${(props) =>
    props.positive
      ? css`
          color: ${props.theme.accentGreen};
        `
      : css`
          color: ${props.theme.accentRed};
        `}}
`;

export const Delta: FC<{ stock: TonendpointStock }> = ({ stock }) => {
  const [positive, delta] = useMemo(() => {
    const today = new BigNumber(stock.today[FiatCurrencies.USD]);
    const yesterday = new BigNumber(stock.yesterday[FiatCurrencies.USD]);
    const delta = today.minus(yesterday);

    const value = delta.div(yesterday).multipliedBy(100).toFixed(2);
    const positive = parseFloat(value) >= 0;
    return [positive, positive ? `+${value}` : value] as const;
  }, [stock]);

  return <DeltaColor positive={positive}>{delta}%</DeltaColor>;
};

export const TonAsset: FC<{
  info: AccountRepr;
  stock: TonendpointStock;
}> = ({ info, stock }) => {
  const { t } = useTranslation();
  const { fiat } = useAppContext();

  const price = useMemo(() => {
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
          <ColumnText
            text={t('Toncoin')}
            secondary={
              <>
                {fiatPrice} {stock && <Delta stock={stock} />}
              </>
            }
          />
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

export const JettonAsset: FC<{
  jetton: JettonBalance;
  stock: TonendpointStock;
}> = ({ jetton, stock }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fiat } = useAppContext();

  const fiatAmount = useMemo(() => {
    if (jetton.verification !== 'whitelist') return null;
    if (!jetton.metadata?.symbol) return null;
    const price = getStockPrice(jetton.metadata?.symbol, stock.today, fiat);
    if (!price) return null;
    const balance = formatAmountValue(
      jetton.balance,
      jetton.metadata?.decimals
    );
    return formatFiatPrice(fiat, price.multipliedBy(balance));
  }, [jetton, stock, fiat]);

  const format = useFormatCoinValue();
  const formattedBalance = format(jetton.balance, jetton.metadata?.decimals);

  return (
    <ListItem
      onClick={() =>
        navigate(
          AppRoute.jettons + `/${encodeURIComponent(jetton.jettonAddress)}`
        )
      }
    >
      <ListItemPayload>
        <Description>
          <Logo src={jetton.metadata?.image} />
          <Label1>
            {jetton.metadata?.name ?? t('Unknown_COIN')}{' '}
            <Symbol>{jetton.metadata?.symbol}</Symbol>
          </Label1>
        </Description>
        {fiatAmount ? (
          <ColumnText text={formattedBalance} secondary={fiatAmount} right />
        ) : (
          <Label1>{formattedBalance}</Label1>
        )}
      </ListItemPayload>
    </ListItem>
  );
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -1rem;
  margin-bottom: 2rem;
`;

const EditButton = styled(Label2)`
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: ${(props) => props.theme.cornerMedium};
  color: ${(props) => props.theme.textPrimary};
  background: ${(props) => props.theme.backgroundContent};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }
`;

export const JettonList: FC<AssetProps> = ({ info, jettons, stock }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <ListBlock>
        <TonAsset info={info} stock={stock} />
        {jettons.balances.map((jetton) => (
          <JettonAsset
            key={jetton.jettonAddress}
            jetton={jetton}
            stock={stock}
          />
        ))}
      </ListBlock>
      {jettons.balances.length > 0 && (
        <ButtonRow>
          <EditButton
            onClick={() => navigate(AppRoute.settings + SettingsRoute.jettons)}
          >
            {t('Edit')}
          </EditButton>
        </ButtonRow>
      )}
    </>
  );
};
