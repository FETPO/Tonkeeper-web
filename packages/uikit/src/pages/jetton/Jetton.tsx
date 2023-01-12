import { JettonBalance, JettonInfo } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  ActivityAction,
  formatDate,
  useFormatCoinValue,
} from '../../components/activity/ActivityAction';
import { Action, ActionsRow } from '../../components/home/Actions';
import { SendIcon } from '../../components/home/HomeIcons';
import { ReceiveAction } from '../../components/home/ReceiveAction';
import { ListBlock, ListItem } from '../../components/List';
import {
  SkeletonAction,
  SkeletonImage,
  SkeletonList,
  SkeletonSubHeader,
  SkeletonText,
} from '../../components/Sceleton';
import { SubHeader } from '../../components/SubHeader';
import { Body2, H2 } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';
import { AppRoute } from '../../libs/routes';
import {
  useJettonBalance,
  useJettonHistory,
  useJettonInfo,
} from '../../state/jetton';

const Block = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0 3rem;
  width: 100%;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
`;

const Image = styled.img`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 100%;
`;

const HistoryBlock = styled.div`
  margin-top: 3rem;
`;

const JettonHistorySkeleton = () => {
  return (
    <HistoryBlock>
      <H2>
        <SkeletonText size="large" />
      </H2>
      <SkeletonList size={3} />
    </HistoryBlock>
  );
};

const JettonSkeleton = () => {
  return (
    <div>
      <SkeletonSubHeader />
      <Block>
        <Text>
          <H2>
            <SkeletonText size="large" />
          </H2>
          <SkeletonText />
          <SkeletonText width="80%" />
        </Text>
        <SkeletonImage width="60px" />
      </Block>
      <ActionsRow>
        <SkeletonAction />
        <SkeletonAction />
      </ActionsRow>

      <JettonHistorySkeleton />
    </div>
  );
};

const List = styled(ListBlock)`
  margin: 0.5rem 0;
`;

const JettonHistory: FC<{ info: JettonInfo; balance: JettonBalance }> = ({
  balance,
}) => {
  const { data: events } = useJettonHistory(balance.walletAddress.address);

  if (!events) {
    return <JettonHistorySkeleton />;
  }

  return (
    <HistoryBlock>
      {events.events.map((event) => {
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
      })}
    </HistoryBlock>
  );
};
const JettonContent: FC<{ jettonAddress: string }> = ({ jettonAddress }) => {
  const { t } = useTranslation();

  const { data: info } = useJettonInfo(jettonAddress);
  const { data: balance } = useJettonBalance(jettonAddress);

  const format = useFormatCoinValue();

  if (!info || !balance) {
    return <JettonSkeleton />;
  }

  const amount = balance?.balance
    ? format(balance?.balance, info.metadata.decimals)
    : '-';

  console.log(info);

  const { description, image, name } = info.metadata;

  return (
    <div>
      <SubHeader title={name} />
      <Block>
        <Text>
          <H2>
            {amount} {info.metadata.symbol}
          </H2>
          {description && <Body2>{description}</Body2>}
        </Text>
        <Image src={image} />
      </Block>
      <ActionsRow>
        <Action icon={<SendIcon />} title={t('Send')} action={() => null} />
        <ReceiveAction />
      </ActionsRow>

      <JettonHistory info={info} balance={balance} />
    </div>
  );
};

export const Jetton = () => {
  const navigate = useNavigate();
  const { jettonAddress } = useParams();

  if (!jettonAddress) return null;

  useEffect(() => {
    if (!jettonAddress) {
      navigate(AppRoute.home);
    }
  }, [jettonAddress]);

  return <JettonContent jettonAddress={decodeURIComponent(jettonAddress)} />;
};
