import { useInfiniteQuery } from '@tanstack/react-query';
import { FiatCurrencySymbolsConfig } from '@tonkeeper/core/dist/entries/fiat';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { Action, EventApi } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC, useMemo } from 'react';
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

const ActivityAction: FC<{ action: Action; address: string; date: string }> = ({
  action,
  address,
  date,
}) => {
  const { fiat } = useAppContext();
  const { format } = useMemo(() => {
    const config = FiatCurrencySymbolsConfig[fiat];
    return new Intl.NumberFormat(config.numberFormat, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }, [fiat]);

  const { t } = useTranslation();
  switch (action.type) {
    case 'TonTransfer': {
      const { tonTransfer } = action;
      if (!tonTransfer) {
        return <>{t('Error')}</>;
      }

      if (tonTransfer.recipient.address === address) {
        return (
          <>
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
              text={`+ ${format(
                formatAmountValue(String(tonTransfer.amount), 9)
              )} TON`}
              secondary={date}
            />
          </>
        );
      } else {
        return (
          <>
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
              text={`- ${format(
                formatAmountValue(String(tonTransfer.amount), 9)
              )} TON`}
              secondary={date}
            />
          </>
        );
      }
    }

    default:
      return <>{action.type}</>;
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
          console.log(event);
          const date = formatDate(event.timestamp);
          return (
            <List key={event.eventId}>
              {event.actions.map((action, index) => (
                <ListItem key={index}>
                  <ListItemPayload>
                    <ActivityAction
                      action={action}
                      address={wallet.address}
                      date={date}
                    />
                  </ListItemPayload>
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
