import { useInfiniteQuery } from '@tanstack/react-query';
import { EventApi } from '@tonkeeper/core/dist/tonApi';
import { throttle } from '@tonkeeper/core/dist/utils/common';
import React, { FC, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { ActivityAction } from '../../components/activity/ActivityAction';
import { EmptyActivity } from '../../components/activity/EmptyActivity';
import { ActivityHeader } from '../../components/Header';
import { ListBlock, ListItem } from '../../components/List';
import { ActivitySkeleton, SkeletonList } from '../../components/Sceleton';
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

const Title = styled(H3)`
  margin: 1.875rem 0 0.875rem;
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
          limit: 20,
          beforeLt: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage.nextFrom,
    });

  useEffect(() => {
    if (!hasNextPage) return () => {};

    const handler = throttle(() => {
      if (isFetchingNextPage) return;
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        fetchNextPage();
      }
    }, 50);

    window.addEventListener('scroll', handler);

    handler();

    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
              <Title>{getActivityTitle(key, t)}</Title>
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
        {isFetchingNextPage && <SkeletonList size={3} />}
      </Body>
    </>
  );
};

export default Activity;
