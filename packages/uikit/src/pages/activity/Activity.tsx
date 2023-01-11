import { useInfiniteQuery } from '@tanstack/react-query';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { EventApi } from '@tonkeeper/core/dist/tonApi';
import React, { FC } from 'react';
import styled from 'styled-components';
import {
  ActivityAction,
  formatDate,
} from '../../components/activity/ActivityAction';
import { Button } from '../../components/fields/Button';
import { ListBlock, ListItem } from '../../components/List';
import { SkeletonList } from '../../components/Sceleton';
import { useAppContext, useWalletContext } from '../../hooks/appContext';

const Body = styled.div`
  flex-grow: 1;
`;

const List = styled(ListBlock)`
  margin: 0.5rem 0;
`;

export const ActivitySkeleton = () => {
  return (
    <Body>
      <SkeletonList size={1} />
      <SkeletonList size={3} />
      <SkeletonList size={2} />
    </Body>
  );
};

export const Activity: FC = () => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, ...result } =
    useInfiniteQuery({
      queryKey: [wallet.active.rawAddress, AppKey.activity],
      queryFn: ({ pageParam = undefined }) =>
        new EventApi(tonApi).accountEvents({
          account: wallet.active.rawAddress,
          limit: 10,
          beforeLt: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.nextFrom,
    });

  if (!data) {
    return <ActivitySkeleton />;
  }

  return (
    <Body>
      {data.pages.map((page) => {
        return page.events.map((event) => {
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
