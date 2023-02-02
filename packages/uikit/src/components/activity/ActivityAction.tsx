import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { Action, NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import BigNumber from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import styled, { css } from 'styled-components';
import {
  ActivityIcon,
  ReceiveIcon,
  SentIcon,
} from '../../components/activity/ActivityIcons';
import { ColumnText } from '../../components/Layout';
import { ListBlock, ListItem, ListItemPayload } from '../../components/List';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
import {
  formatDecimals,
  formatFiatCurrency,
  getTonCoinStockPrice,
  useFormatCoinValue,
} from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { useTonenpointStock } from '../../state/tonendpoint';
import { Button } from '../fields/Button';
import { Body1, Label1 } from '../Text';
import { ActionData } from './ActivityNotification';
import { Comment, ErrorAction, ListItemGrid } from './CommonAction';
import { ContractDeployAction } from './ContractDeployAction';
import { NftComment, NftItemTransferAction } from './NftActivity';
import {
  ActionDate,
  ActionDetailsRecipient,
  ActionDetailsSender,
  ErrorActivityNotification,
  Label,
  Title,
} from './NotificationCommon';
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

const Amount = styled(Body1)`
  display: block;
  user-select: none;
  color: ${(props) => props.theme.textSecondary};
`;

const Block = styled.div`
  text-align: center;
  display: flex;
  gap: 2rem;
  flex-direction: column;
  align-items: center;
`;

const useBalanceValue = (
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

export const TonTransferActionNotification: FC<ActionData> = ({
  action,
  timestamp,
  event,
}) => {
  console.log(action);

  const { t } = useTranslation();
  const wallet = useWalletContext();
  const { tonTransfer } = action;
  const sdk = useAppSdk();

  const format = useFormatCoinValue();
  const { fiat, tonendpoint } = useAppContext();
  const { data: stock } = useTonenpointStock(tonendpoint);

  const price = useBalanceValue(tonTransfer?.amount, stock, fiat);

  if (!tonTransfer) {
    return <ErrorActivityNotification />;
  }

  if (tonTransfer.recipient.address === wallet.active.rawAddress) {
    return (
      <Block>
        <div>
          <Title>+ {format(tonTransfer.amount)} TON</Title>
          {price && <Amount>≈ {price}</Amount>}
          <ActionDate kind="received" timestamp={timestamp} />
        </div>
        <ListBlock margin={false} fullWidth>
          <ActionDetailsRecipient recipient={tonTransfer.recipient} />
          {tonTransfer.comment && (
            <ListItem>
              <ListItemPayload>
                <Label>{t('message')}</Label>
                <Label1>{tonTransfer.comment}</Label1>
              </ListItemPayload>
            </ListItem>
          )}
        </ListBlock>
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
  }

  return (
    <Block>
      <div>
        <Title>- {format(tonTransfer.amount)} TON</Title>
        {price && <Amount>≈ {price}</Amount>}
        <ActionDate kind="send" timestamp={timestamp} />
      </div>
      <ListBlock margin={false} fullWidth>
        <ActionDetailsSender sender={tonTransfer.sender} />
        {tonTransfer.comment && (
          <ListItem>
            <ListItemPayload>
              <Label>{t('message')}</Label>
              <Label1>{tonTransfer.comment}</Label1>
            </ListItemPayload>
          </ListItem>
        )}
      </ListBlock>
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

export const AuctionBidAction: FC<{
  action: Action;
  date: string;
  openNft: (nft: NftItemRepr) => void;
}> = ({ action, date, openNft }) => {
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
      {auctionBid.nft && (
        <NftComment address={auctionBid.nft.address} openNft={openNft} />
      )}
    </ListItemGrid>
  );
};

export const ActivityAction: FC<{
  action: Action;
  date: string;
  openNft: (nft: NftItemRepr) => void;
}> = ({ action, date, openNft }) => {
  const { t } = useTranslation();

  switch (action.type) {
    case 'TonTransfer':
      return <TonTransferAction action={action} date={date} />;
    case 'JettonTransfer':
      return <JettonTransferAction action={action} date={date} />;
    case 'NftItemTransfer':
      return (
        <NftItemTransferAction action={action} date={date} openNft={openNft} />
      );
    case 'ContractDeploy':
      return (
        <ContractDeployAction action={action} date={date} openNft={openNft} />
      );
    case 'UnSubscribe':
      return <UnSubscribeAction action={action} date={date} />;
    case 'Subscribe':
      return <SubscribeAction action={action} date={date} />;
    case 'AuctionBid':
      return <AuctionBidAction action={action} date={date} openNft={openNft} />;
    case 'Unknown':
      return <ErrorAction>{t('Unknown')}</ErrorAction>;
    default: {
      console.log(action);
      return <ListItemPayload>{action.type}</ListItemPayload>;
    }
  }
};
