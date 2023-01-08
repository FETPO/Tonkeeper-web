import { useInfiniteQuery } from '@tanstack/react-query';
import { FiatCurrencySymbolsConfig } from '@tonkeeper/core/dist/entries/fiat';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { Action, EventApi } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  ActivityIcon,
  ReceiveIcon,
  SentIcon,
} from '../../components/activity/ActivityIcons';
import { Button } from '../../components/fields/Button';
import { ColumnText } from '../../components/Layout';
import { ListBlock, ListItem, ListItemPayload } from '../../components/List';
import { Loading } from '../../components/Loading';
import { Label1 } from '../../components/Text';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { formatAmountValue } from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';

const Body = styled.div`
  flex-grow: 1;
`;

const List = styled(ListBlock)`
  margin: 0.5rem 0;
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const formatDate = (timestamp: number): string => {
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
      const value = formatAmountValue(String(amount), decimals);

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

  if (tonTransfer.recipient.address === wallet.address) {
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

export const JettonTransferAction: FC<{ action: Action; date: string }> = ({
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

  if (jettonTransfer.sender?.address === wallet.address) {
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

const ActivityAction: FC<{ action: Action; date: string }> = ({
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

export const Activity: FC = () => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, ...result } =
    useInfiniteQuery({
      queryKey: [wallet.tonkeeperId, AppKey.activity],
      queryFn: ({ pageParam = undefined }) =>
        new EventApi(tonApi).accountEvents({
          account: wallet.address,
          limit: 10,
          beforeLt: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.nextFrom,
    });

  if (!data) {
    return <Loading />;
  }

  return (
    <Body>
      {data.pages.map((page) => {
        return page.events.map((event) => {
          //console.log(event);
          const date = formatDate(event.timestamp);
          return (
            <List key={event.eventId}>
              {event.actions.map((action, index) => (
                <ListItem key={index}>
                  <ActivityAction action={action} date={date} />
                </ListItem>
              ))}
            </List>
          );
        });
      })}
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
          Next
        </Button>
      )}
    </Body>
  );
};
