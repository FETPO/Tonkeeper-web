import { Action, NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import {
  ActivityIcon,
  ReceiveIcon,
  SentIcon,
} from '../../components/activity/ActivityIcons';
import { ListItemPayload } from '../../components/List';
import { useWalletContext } from '../../hooks/appContext';
import { useFormatCoinValue } from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { Label1 } from '../Text';
import {
  AmountText,
  Comment,
  Description,
  ErrorAction,
  FirstLabel,
  FirstLine,
  ListItemGrid,
  SecondaryText,
  SecondLine,
} from './CommonAction';
import { ContractDeployAction } from './ContractDeployAction';
import { NftComment, NftItemTransferAction } from './NftActivity';
import { SubscribeAction, UnSubscribeAction } from './SubscribeAction';

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
            <FirstLabel>
              {tonTransfer.sender.isScam
                ? t('spam_action')
                : t('transaction_type_receive')}
            </FirstLabel>
            <AmountText isScam={tonTransfer.sender.isScam} green>
              +&thinsp;{format(tonTransfer.amount)}
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
          <FirstLabel>{t('transaction_type_sent')}</FirstLabel>
          <AmountText>-&thinsp;{format(tonTransfer.amount)}</AmountText>
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
            <FirstLabel>{t('transaction_type_sent')}</FirstLabel>
            <AmountText>
              -&thinsp;
              {format(jettonTransfer.amount, jettonTransfer.jetton.decimals)}
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
          <FirstLabel>{t('transaction_type_receive')}</FirstLabel>
          <AmountText isScam={jettonTransfer.sender?.isScam} green>
            +&thinsp;
            {format(jettonTransfer.amount, jettonTransfer.jetton.decimals)}
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
          <FirstLabel>{t('Bid')}</FirstLabel>
          <AmountText>-&thinsp;{format(auctionBid.amount.value)}</AmountText>
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
      return (
        <ErrorAction>
          {t('txActions_signRaw_types_unknownTransaction')}
        </ErrorAction>
      );
    default: {
      console.log(action);
      return <ListItemPayload>{action.type}</ListItemPayload>;
    }
  }
};
