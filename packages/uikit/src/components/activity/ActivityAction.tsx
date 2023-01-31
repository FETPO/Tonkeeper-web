import { Action } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import {
  ActivityIcon,
  ReceiveIcon,
  SentIcon,
} from '../../components/activity/ActivityIcons';
import { ColumnText } from '../../components/Layout';
import { ListItemPayload } from '../../components/List';
import { useWalletContext } from '../../hooks/appContext';
import { useFormatCoinValue } from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { Comment, ErrorAction, ListItemGrid } from './CommonAction';
import { ContractDeployAction } from './ContractDeployAction';
import { NftComment, NftItemTransferAction } from './NftActivity';
import { SubscribeAction, UnSubscribeAction } from './SubscribeAction';

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
};

const ReceivedText = styled.span<{ isScam?: boolean }>`
  ${(props) =>
    props.isScam
      ? css`
          color: ${props.theme.textTertiary};
        `
      : css`
          color: ${props.theme.accentGreen};
        `}
`;

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
      <ListItemGrid>
        <ActivityIcon>
          <ReceiveIcon />
        </ActivityIcon>
        <ColumnText
          text={tonTransfer.sender.isScam ? t('Span') : t('Received')}
          secondary={
            tonTransfer.sender.name ??
            toShortAddress(tonTransfer.sender.address)
          }
        />
        <ColumnText
          right
          noWrap
          text={
            <ReceivedText isScam={tonTransfer.sender.isScam}>{`+ ${format(
              tonTransfer.amount
            )} TON`}</ReceivedText>
          }
          secondary={date}
        />
        <Comment comment={tonTransfer.comment} />
      </ListItemGrid>
    );
  }
  return (
    <ListItemGrid>
      <ActivityIcon>
        <SentIcon />
      </ActivityIcon>
      <ColumnText
        text={t('Sent')}
        secondary={
          tonTransfer.recipient.name ??
          toShortAddress(tonTransfer.recipient.address)
        }
      />
      <ColumnText
        right
        noWrap
        text={`- ${format(tonTransfer.amount)} TON`}
        secondary={date}
      />
      <Comment comment={tonTransfer.comment} />
    </ListItemGrid>
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
      <ListItemGrid>
        <ActivityIcon>
          <SentIcon />
        </ActivityIcon>
        <ColumnText
          text={t('Sent')}
          secondary={
            jettonTransfer.recipient?.name ??
            toShortAddress(
              jettonTransfer.recipient?.address ??
                jettonTransfer.recipientsWallet
            )
          }
        />
        <ColumnText
          right
          noWrap
          text={`- ${format(
            jettonTransfer.amount,
            jettonTransfer.jetton.decimals
          )} ${jettonTransfer.jetton.symbol}`}
          secondary={date}
        />
      </ListItemGrid>
    );
  }

  return (
    <ListItemGrid>
      <ActivityIcon>
        <ReceiveIcon />
      </ActivityIcon>
      <ColumnText
        text={t('Received')}
        secondary={
          jettonTransfer.sender?.name ??
          toShortAddress(
            jettonTransfer.sender?.address ?? jettonTransfer.sendersWallet
          )
        }
      />

      <ColumnText
        right
        noWrap
        text={
          <ReceivedText isScam={jettonTransfer.sender?.isScam}>{`+ ${format(
            jettonTransfer.amount,
            jettonTransfer.jetton.decimals
          )} ${jettonTransfer.jetton.symbol}`}</ReceivedText>
        }
        secondary={date}
      />
    </ListItemGrid>
  );
};

export const AuctionBidAction: FC<{ action: Action; date: string }> = ({
  action,
  date,
}) => {
  const { t } = useTranslation();
  const { auctionBid } = action;

  const format = useFormatCoinValue();

  if (!auctionBid) {
    return <ErrorAction />;
  }

  return (
    <ListItemGrid>
      <ActivityIcon>
        <SentIcon />
      </ActivityIcon>
      <ColumnText
        text={t('Bid')}
        secondary={
          auctionBid.auctionType ??
          toShortAddress(auctionBid.beneficiary.address)
        }
      />
      <ColumnText
        right
        noWrap
        text={`- ${format(auctionBid.amount.value)} ${
          auctionBid.amount.tokenName
        }`}
        secondary={date}
      />
      {auctionBid.nft && <NftComment address={auctionBid.nft.address} />}
    </ListItemGrid>
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
    case 'NftItemTransfer':
      return <NftItemTransferAction action={action} date={date} />;
    case 'ContractDeploy':
      return <ContractDeployAction action={action} date={date} />;
    case 'UnSubscribe':
      return <UnSubscribeAction action={action} date={date} />;
    case 'Subscribe':
      return <SubscribeAction action={action} date={date} />;
    case 'AuctionBid':
      return <AuctionBidAction action={action} date={date} />;
    case 'Unknown':
      return <ErrorAction>{t('Unknown')}</ErrorAction>;
    default: {
      console.log(action);
      return <ListItemPayload>{action.type}</ListItemPayload>;
    }
  }
};
