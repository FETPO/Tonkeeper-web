import { useInfiniteQuery } from '@tanstack/react-query';
import { EventApi, NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import { throttle } from '@tonkeeper/core/dist/utils/common';
import React, { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ActivityGroupRaw } from '../../components/activity/ActivityGroup';
import {
  ActionData,
  ActivityNotification,
} from '../../components/activity/ActivityNotification';
import { EmptyActivity } from '../../components/activity/EmptyActivity';
import { ActivityHeader } from '../../components/Header';
import { NftNotification } from '../../components/nft/NftNotification';
import { ActivitySkeleton, SkeletonList } from '../../components/Skeleton';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { QueryKey } from '../../libs/queryKey';
import { ActivityGroup, groupActivity } from '../../state/activity';

const Body = styled.div`
  flex-grow: 1;
  padding: 0 1rem;
`;

const Activity: FC = () => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();

  const [nft, setNft] = useState<NftItemRepr | undefined>(undefined);
  const [activity, setActivity] = useState<ActionData | undefined>(undefined);

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
        <ActivityGroupRaw
          items={items}
          openNft={setNft}
          openActivity={setActivity}
        />
        {isFetchingNextPage && <SkeletonList size={3} />}
      </Body>
      <NftNotification nftItem={nft} handleClose={() => setNft(undefined)} />
      <ActivityNotification
        value={activity}
        handleClose={() => setActivity(undefined)}
      />
    </>
  );
};

export default Activity;
