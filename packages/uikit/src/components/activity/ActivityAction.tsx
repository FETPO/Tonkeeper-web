import { Action, NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import styled from 'styled-components';
import {
  ActivityIcon,
  ReceiveIcon,
  SentIcon,
} from '../../components/activity/ActivityIcons';
import { ListBlock, ListItem, ListItemPayload } from '../../components/List';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
import { useFormatCoinValue } from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { useTonenpointStock } from '../../state/tonendpoint';
import { Button } from '../fields/Button';
import { Body1, Label1 } from '../Text';
import { ActionData } from './ActivityNotification';
import {
  AmountText,
  Comment,
  Description,
  ErrorAction,
  FirstLine,
  ListItemGrid,
  SecondaryText,
  SecondLine,
} from './CommonAction';
import { ContractDeployAction } from './ContractDeployAction';
import { NftComment, NftItemTransferAction } from './NftActivity';
import {
  ActionDate,
  ActionFeeDetails,
  ActionRecipientDetails,
  ActionSenderDetails,
  ErrorActivityNotification,
  Label,
  Title,
  useBalanceValue,
} from './NotificationCommon';
import { SubscribeAction, UnSubscribeAction } from './SubscribeAction';

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

export const TonTransferActionNotification: FC<ActionData> = ({
  action,
  timestamp,
  event,
}) => {
  console.log(action, event);

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
          <ActionRecipientDetails recipient={tonTransfer.recipient} />
          <ActionFeeDetails fee={event.fee} stock={stock} fiat={fiat} />
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
        <ActionSenderDetails sender={tonTransfer.sender} />
        <ActionFeeDetails fee={event.fee} stock={stock} fiat={fiat} />
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
        <Description>
          <FirstLine>
            <Label1>
              {tonTransfer.sender.isScam ? t('Span') : t('Received')}
            </Label1>
            <AmountText isScam={tonTransfer.sender.isScam} green>
              + {format(tonTransfer.amount)}
            </AmountText>
            <AmountText isScam={tonTransfer.sender.isScam} green>
              TON
            </AmountText>
          </FirstLine>
          <SecondLine>
            <SecondaryText>
              {tonTransfer.sender.name ??
                toShortAddress(tonTransfer.sender.address)}
            </SecondaryText>
            <SecondaryText>{date}</SecondaryText>
          </SecondLine>
        </Description>
        <Comment comment={tonTransfer.comment} />
      </ListItemGrid>
    );
  }
  return (
    <ListItemGrid>
      <ActivityIcon>
        <SentIcon />
      </ActivityIcon>
      <Description>
        <FirstLine>
          <Label1>{t('Sent')}</Label1>
          <AmountText>- {format(tonTransfer.amount)}</AmountText>
          <Label1>TON</Label1>
        </FirstLine>
        <SecondLine>
          <SecondaryText>
            {tonTransfer.recipient.name ??
              toShortAddress(tonTransfer.recipient.address)}
          </SecondaryText>
          <SecondaryText>{date}</SecondaryText>
        </SecondLine>
      </Description>
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
        <Description>
          <FirstLine>
            <Label1>{t('Sent')}</Label1>
            <AmountText>
              - {format(jettonTransfer.amount, jettonTransfer.jetton.decimals)}
            </AmountText>
            <Label1>{jettonTransfer.jetton.symbol}</Label1>
          </FirstLine>
          <SecondLine>
            <SecondaryText>
              {jettonTransfer.recipient?.name ??
                toShortAddress(
                  jettonTransfer.recipient?.address ??
                    jettonTransfer.recipientsWallet
                )}
            </SecondaryText>
            <SecondaryText>{date}</SecondaryText>
          </SecondLine>
        </Description>
      </ListItemGrid>
    );
  }

  return (
    <ListItemGrid>
      <ActivityIcon>
        <ReceiveIcon />
      </ActivityIcon>
      <Description>
        <FirstLine>
          <Label1>{t('Received')}</Label1>
          <AmountText isScam={jettonTransfer.sender?.isScam} green>
            + {format(jettonTransfer.amount, jettonTransfer.jetton.decimals)}
          </AmountText>
          <AmountText isScam={jettonTransfer.sender?.isScam} green>
            {jettonTransfer.jetton.symbol}
          </AmountText>
        </FirstLine>
        <SecondLine>
          <SecondaryText>
            {jettonTransfer.sender?.name ??
              toShortAddress(
                jettonTransfer.sender?.address ?? jettonTransfer.sendersWallet
              )}
          </SecondaryText>
          <SecondaryText>{date}</SecondaryText>
        </SecondLine>
      </Description>
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
      <Description>
        <FirstLine>
          <Label1>{t('Bid')}</Label1>
          <AmountText>- {format(auctionBid.amount.value)}</AmountText>
          <AmountText>{auctionBid.amount.tokenName}</AmountText>
        </FirstLine>
        <SecondLine>
          <SecondaryText>
            {auctionBid.auctionType ??
              toShortAddress(auctionBid.beneficiary.address)}
          </SecondaryText>
          <SecondaryText>{date}</SecondaryText>
        </SecondLine>
      </Description>
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
