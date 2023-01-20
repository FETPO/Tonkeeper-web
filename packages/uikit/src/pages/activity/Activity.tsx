import { useInfiniteQuery } from '@tanstack/react-query';
import { EventApi } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { ActivityAction } from '../../components/activity/ActivityAction';
import { EmptyActivity } from '../../components/activity/EmptyActivity';
import { Button } from '../../components/fields/Button';
import { ActivityHeader } from '../../components/Header';
import { ListBlock, ListItem } from '../../components/List';
import { ActivitySkeleton } from '../../components/Sceleton';
import { H3 } from '../../components/Text';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { QueryKey } from '../../libs/queryKey';
import {
  ActivityGroup,
  formatActivityDate,
  getActivityTitle,
  groupActivity,
} from '../../state/activity';

const Body = styled.div`
  flex-grow: 1;
`;

const List = styled(ListBlock)`
  margin: 0.5rem 0;
`;

const Activity: FC = () => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  const { t } = useTranslation();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, ...result } =
    useInfiniteQuery({
      queryKey: [wallet.active.rawAddress, QueryKey.activity],
      queryFn: ({ pageParam = undefined }) =>
        new EventApi(tonApi).accountEvents({
          account: wallet.active.rawAddress,
          limit: 10,
          beforeLt: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.nextFrom,
    });

  const items = useMemo<ActivityGroup[]>(() => {
    return data ? groupActivity(data) : [];
  }, [data]);

  if (!data) {
    return <ActivitySkeleton />;
  }

  if (items.length === 0) {
    return <EmptyActivity />;
  }

  return (
    <>
      <ActivityHeader />
      <Body>
        {items.map(([key, events]) => {
          return (
            <div key={key}>
              <H3>{getActivityTitle(key, t)}</H3>
              {events.map(({ timestamp, event }) => {
                const date = formatActivityDate(key, timestamp);
                return (
                  <List key={event.eventId}>
                    {event.actions.map((action, index) => (
                      <ListItem key={index}>
                        <ActivityAction action={action} date={date} />
                      </ListItem>
                    ))}
                  </List>
                );
              })}
            </div>
          );
        })}

        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
            Next
          </Button>
        )}
      </Body>
    </>
  );
};

export default Activity;
