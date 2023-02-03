import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { AccountAddress, AccountEvent, Fee } from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import {
  toShortAddress,
  toShortValue,
} from '@tonkeeper/core/dist/utils/common';
import BigNumber from 'bignumber.js';
import React, { FC, PropsWithChildren, useMemo } from 'react';
import styled from 'styled-components';
import { useAppSdk } from '../../hooks/appSdk';
import {
  formatDecimals,
  formatFiatCurrency,
  getTonCoinStockPrice,
  useFormatCoinValue,
} from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { Button } from '../fields/Button';
import { ColumnText } from '../Layout';
import { ListItem, ListItemPayload } from '../List';
import { NotificationBlock } from '../Notification';
import { Body1, H2, Label1 } from '../Text';

export const Title = styled(H2)`
  user-select: none;
`;

const Timestamp = styled(Body1)`
  user-select: none;
  color: ${(props) => props.theme.textSecondary};
`;

export const Label = styled(Body1)`
  user-select: none;
  color: ${(props) => props.theme.textSecondary};
`;

export const ActionDate: FC<{
  kind: 'received' | 'send';
  timestamp: number;
}> = ({ kind, timestamp }) => {
  const { t, i18n } = useTranslation();

  const data = useMemo(() => {
    return new Intl.DateTimeFormat(i18n.language, {
      month: 'short',
      day: 'numeric',
      year:
        new Date().getFullYear() - 1 === new Date(timestamp).getFullYear()
          ? 'numeric'
          : undefined,
      hour: 'numeric',
      minute: 'numeric',
    }).format(timestamp);
  }, [timestamp, i18n.language]);

  return (
    <Timestamp>
      {kind === 'received' ? t('received_on') : t('send_on')} {data}
    </Timestamp>
  );
};

export const useBalanceValue = (
  amount: number | undefined,
  stock: TonendpointStock | undefined,
  fiat: FiatCurrencies
) => {
  return useMemo(() => {
    if (!stock || !amount) {
      return undefined;
    }
    const ton = new BigNumber(amount).multipliedBy(
      formatDecimals(getTonCoinStockPrice(stock.today, fiat))
    );
    return formatFiatCurrency(fiat, ton);
  }, [amount, stock]);
};

export const ErrorActivityNotification: FC<PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation();
  return (
    <NotificationBlock>
      <Title>{children ?? t('Unknown')}</Title>
    </NotificationBlock>
  );
};

export const ActionRecipientDetails: FC<{ recipient: AccountAddress }> = ({
  recipient,
}) => {
  const { t } = useTranslation();
  const sdk = useAppSdk();
  return (
    <>
      {recipient.name && (
        <ListItem onClick={() => sdk.copyToClipboard(recipient.name!)}>
          <ListItemPayload>
            <Label>{t('recipient')}</Label>
            <Label1>{recipient.name}</Label1>
          </ListItemPayload>
        </ListItem>
      )}
      <ListItem onClick={() => sdk.copyToClipboard(recipient.address)}>
        <ListItemPayload>
          <Label>
            {recipient.name ? t('recipient_address') : t('recipient')}
          </Label>
          <Label1>{toShortAddress(recipient.address)}</Label1>
        </ListItemPayload>
      </ListItem>
    </>
  );
};

export const ActionSenderDetails: FC<{ sender: AccountAddress }> = ({
  sender,
}) => {
  const { t } = useTranslation();
  const sdk = useAppSdk();
  return (
    <>
      {sender.name && (
        <ListItem onClick={() => sdk.copyToClipboard(sender.name!)}>
          <ListItemPayload>
            <Label>{t('sender')}</Label>
            <Label1>{sender.name}</Label1>
          </ListItemPayload>
        </ListItem>
      )}
      <ListItem onClick={() => sdk.copyToClipboard(sender.address)}>
        <ListItemPayload>
          <Label>{sender.name ? t('sender_address') : t('sender')}</Label>
          <Label1>{toShortAddress(sender.address)}</Label1>
        </ListItemPayload>
      </ListItem>
    </>
  );
};

export const ActionTransactionDetails: FC<{ event: AccountEvent }> = ({
  event,
}) => {
  const { t } = useTranslation();
  const sdk = useAppSdk();
  return (
    <ListItem
      onClick={() =>
        sdk.copyToClipboard(event.eventId, t('copy_transaction_id'))
      }
    >
      <ListItemPayload>
        <Label>{t('transaction')}</Label>
        <Label1>{toShortValue(event.eventId, 8)}</Label1>
      </ListItemPayload>
    </ListItem>
  );
};

export const ActionDeployerDetails: FC<{ deployer: AccountAddress }> = ({
  deployer,
}) => {
  const { t } = useTranslation();
  const sdk = useAppSdk();

  return (
    <>
      {deployer.name && (
        <ListItem onClick={() => sdk.copyToClipboard(deployer.address)}>
          <ListItemPayload>
            <Label>{t('deployer')}</Label>
            <Label1>{deployer.name}</Label1>
          </ListItemPayload>
        </ListItem>
      )}
      <ListItem onClick={() => sdk.copyToClipboard(deployer.address)}>
        <ListItemPayload>
          <Label>{deployer.name ? t('deployer_address') : t('deployer')}</Label>
          <Label1>{toShortAddress(deployer.address)}</Label1>
        </ListItemPayload>
      </ListItem>
    </>
  );
};

export const ActionFeeDetails: FC<{
  fee: Fee;
  stock: TonendpointStock | undefined;
  fiat: FiatCurrencies;
}> = ({ fee, stock, fiat }) => {
  const { t } = useTranslation();

  const format = useFormatCoinValue();
  const sdk = useAppSdk();

  const price = useBalanceValue(fee.total, stock, fiat);

  return (
    <ListItem onClick={() => sdk.copyToClipboard(format(fee.total))}>
      <ListItemPayload>
        <Label>{t('fee')}</Label>
        <ColumnText
          right
          text={`${format(fee.total)} TON`}
          secondary={`≈ ${price}`}
        />
      </ListItemPayload>
    </ListItem>
  );
};

const Block = styled.div`
  text-align: center;
  display: flex;
  gap: 2rem;
  flex-direction: column;
  align-items: center;
`;

export const ActionDetailsBlock: FC<
  PropsWithChildren<{ event: AccountEvent }>
> = ({ event, children }) => {
  const { t } = useTranslation();
  const sdk = useAppSdk();

  return (
    <Block>
      {children}
      <Button
        size="large"
        fullWidth
        onClick={() =>
          sdk.openPage(`https://tonapi.io/transaction/${event.eventId}`)
        }
      >
        {t('View_in_explorer')}
      </Button>
    </Block>
  );
};
