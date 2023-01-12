import { FiatCurrencySymbolsConfig } from '@tonkeeper/core/dist/entries/fiat';
import { Action } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  ActivityIcon,
  ReceiveIcon,
  SentIcon,
} from '../../components/activity/ActivityIcons';
import { ColumnText } from '../../components/Layout';
import { ListItemPayload } from '../../components/List';
import { Label1 } from '../../components/Text';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { formatDecimals } from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
};

export const useFormatCoinValue = () => {
  const { fiat } = useAppContext();

  const commonFormat = useMemo(
    () =>
      new Intl.NumberFormat(FiatCurrencySymbolsConfig[fiat].numberFormat, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [fiat]
  );

  return useCallback(
    (amount: number | string, decimals: number = 9) => {
      const value = formatDecimals(String(amount), decimals);

      const formatted = commonFormat.format(value);
      if (formatted != '0') {
        return formatted;
      }

      const countFormat = new Intl.NumberFormat(
        FiatCurrencySymbolsConfig[fiat].numberFormat,
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: decimals,
        }
      );

      return countFormat.format(value);
    },
    [fiat, commonFormat]
  );
};

const ErrorAction: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <ListItemPayload>
      <Row>
        <ActivityIcon>
          <ReceiveIcon />
        </ActivityIcon>
        <Label1>{children ?? t('Error')}</Label1>
      </Row>
    </ListItemPayload>
  );
};

const TonTransferAction: FC<{ action: Action; date: string }> = ({
  action,
  date,
}) => {
  const { t } = useTranslation();
  const wallet = useWalletContext();
  const { tonTransfer } = action;

  const format = useFormatCoinValue();

  if (!tonTransfer) {
    return <ErrorAction />;
  }

  if (tonTransfer.recipient.address === wallet.active.rawAddress) {
    return (
      <ListItemPayload>
        <Row>
          <ActivityIcon>
            <ReceiveIcon />
          </ActivityIcon>
          <ColumnText
            text={t('Received')}
            secondary={toShortAddress(tonTransfer.sender.address)}
          />
        </Row>

        <ColumnText
          right
          green
          text={`+ ${format(tonTransfer.amount)} TON`}
          secondary={date}
        />
      </ListItemPayload>
    );
  }
  return (
    <ListItemPayload>
      <Row>
        <ActivityIcon>
          <SentIcon />
        </ActivityIcon>
        <ColumnText
          text={t('Sent')}
          secondary={toShortAddress(tonTransfer.recipient.address)}
        />
      </Row>
      <ColumnText
        right
        text={`- ${format(tonTransfer.amount)} TON`}
        secondary={date}
      />
    </ListItemPayload>
  );
};

const JettonTransferAction: FC<{ action: Action; date: string }> = ({
  action,
  date,
}) => {
  const { t } = useTranslation();
  const wallet = useWalletContext();
  const { jettonTransfer } = action;

  const format = useFormatCoinValue();

  if (!jettonTransfer) {
    return <ErrorAction />;
  }

  if (jettonTransfer.sender?.address === wallet.active.rawAddress) {
    return (
      <ListItemPayload>
        <Row>
          <ActivityIcon>
            <SentIcon />
          </ActivityIcon>
          <ColumnText
            text={t('Sent')}
            secondary={toShortAddress(
              jettonTransfer.sender?.address ?? jettonTransfer.sendersWallet
            )}
          />
        </Row>
        <ColumnText
          right
          text={`- ${format(
            jettonTransfer.amount,
            jettonTransfer.jetton.decimals
          )} ${jettonTransfer.jetton.symbol}`}
          secondary={date}
        />
      </ListItemPayload>
    );
  }

  return (
    <ListItemPayload>
      <Row>
        <ActivityIcon>
          <ReceiveIcon />
        </ActivityIcon>
        <ColumnText
          text={t('Received')}
          secondary={toShortAddress(jettonTransfer.recipientsWallet)}
        />
      </Row>

      <ColumnText
        right
        green
        text={`+ ${format(
          jettonTransfer.amount,
          jettonTransfer.jetton.decimals
        )} ${jettonTransfer.jetton.symbol}`}
        secondary={date}
      />
    </ListItemPayload>
  );
};

export const ActivityAction: FC<{ action: Action; date: string }> = ({
  action,
  date,
}) => {
  const { t } = useTranslation();

  switch (action.type) {
    case 'TonTransfer':
      return <TonTransferAction action={action} date={date} />;
    case 'JettonTransfer':
      return <JettonTransferAction action={action} date={date} />;
    case 'Unknown':
      return <ErrorAction>{t('Unknown')}</ErrorAction>;
    default: {
      console.log(action);
      return <ListItemPayload>{action.type}</ListItemPayload>;
    }
  }
};
