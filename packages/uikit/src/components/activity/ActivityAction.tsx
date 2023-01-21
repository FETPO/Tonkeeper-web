import { FiatCurrencySymbolsConfig } from '@tonkeeper/core/dist/entries/fiat';
import { Action } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  ActivityIcon,
  ReceiveIcon,
  SentIcon,
} from '../../components/activity/ActivityIcons';
import { ColumnText } from '../../components/Layout';
import { ListItemPayload } from '../../components/List';
import { Body2, Label1 } from '../../components/Text';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { formatDecimals } from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { useNftItemData } from '../../state/wallet';

const ListItemGrid = styled(ListItemPayload)`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  column-gap: 1rem;
  row-gap: 0.5rem;
`;

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
};

export const useFormatCoinValue = () => {
  const { fiat } = useAppContext();

  const commonFormat = useMemo(
    () =>
      new Intl.NumberFormat(FiatCurrencySymbolsConfig[fiat].numberFormat, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [fiat]
  );

  return useCallback(
    (amount: number | string, decimals: number = 9) => {
      const value = formatDecimals(String(amount), decimals);

      const formatted = commonFormat.format(value);
      if (formatted != '0') {
        return formatted;
      }

      const countFormat = new Intl.NumberFormat(
        FiatCurrencySymbolsConfig[fiat].numberFormat,
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: decimals,
        }
      );

      return countFormat.format(value);
    },
    [fiat, commonFormat]
  );
};

const NftBlock = styled.div`
  background: ${(props) => props.theme.backgroundContentTint};
  border-radius: ${(props) => props.theme.cornerMedium};
  overflow: hidden;
  display: flex;
  overflow: hidden;
`;
const NftText = styled.div`
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  overflow: hidden;
`;

const Body = styled(Body2)`
  text-overflow: ellipsis;
  overflow: hidden;
`;
const BodySecondary = styled(Body2)`
  color: ${(props) => props.theme.textSecondary};
  text-overflow: ellipsis;
  overflow: hidden;
`;
const NftComment: FC<{ address: string }> = ({ address }) => {
  const { data } = useNftItemData(address);
  if (!data) return <></>;
  console.log(data);
  return (
    <>
      <div></div>
      <NftBlock>
        {data.metadata.image && (
          <img height="64" width="64" src={data.metadata.image} />
        )}
        <NftText>
          <Body>{data.dns ? 'TON DNS Domains' : data.metadata.name}</Body>
          <BodySecondary>{data.dns ?? data.metadata.description}</BodySecondary>
        </NftText>
      </NftBlock>
    </>
  );
};

const CommentMessage = styled(Body2)`
  padding: 0.5rem 0.75rem;
  background: ${(props) => props.theme.backgroundContentTint};
  border-radius: ${(props) => props.theme.cornerMedium};
  line-break: anywhere;
  display: inline-flex;
`;

const Comment: FC<{ comment?: string }> = ({ comment }) => {
  if (!comment) return <></>;
  return (
    <>
      <div></div>
      <div>
        <CommentMessage>{comment}</CommentMessage>
      </div>
    </>
  );
};
const ErrorAction: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <ListItemGrid>
      <ActivityIcon>
        <ReceiveIcon />
      </ActivityIcon>
      <Label1>{children ?? t('Error')}</Label1>
    </ListItemGrid>
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
          text={t('Received')}
          secondary={toShortAddress(tonTransfer.sender.address)}
        />
        <ColumnText
          right
          green
          noWrap
          text={`+ ${format(tonTransfer.amount)} TON`}
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
        secondary={toShortAddress(tonTransfer.recipient.address)}
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
          secondary={toShortAddress(
            jettonTransfer.sender?.address ?? jettonTransfer.sendersWallet
          )}
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
        secondary={toShortAddress(jettonTransfer.recipientsWallet)}
      />

      <ColumnText
        right
        green
        noWrap
        text={`+ ${format(
          jettonTransfer.amount,
          jettonTransfer.jetton.decimals
        )} ${jettonTransfer.jetton.symbol}`}
        secondary={date}
      />
    </ListItemGrid>
  );
};

const NftItemTransferAction: FC<{ action: Action; date: string }> = ({
  action,
  date,
}) => {
  const { t } = useTranslation();
  const wallet = useWalletContext();
  const { nftItemTransfer } = action;
  if (!nftItemTransfer) {
    return <ErrorAction />;
  }

  if (nftItemTransfer.sender?.address === wallet.active.rawAddress) {
    return (
      <ListItemGrid>
        <ActivityIcon>
          <SentIcon />
        </ActivityIcon>
        <ColumnText
          text={t('Sent')}
          secondary={toShortAddress(
            nftItemTransfer.sender?.address ?? nftItemTransfer.nft
          )}
        />
        <ColumnText right noWrap text={`NFT`} secondary={date} />
        <NftComment address={nftItemTransfer.nft} />
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
        secondary={toShortAddress(
          nftItemTransfer.recipient?.address ?? nftItemTransfer.nft
        )}
      />

      <ColumnText right noWrap text={`NFT`} secondary={date} />
      <NftComment address={nftItemTransfer.nft} />
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
    case 'Unknown':
      return <ErrorAction>{t('Unknown')}</ErrorAction>;
    default: {
      console.log(action);
      return <ListItemPayload>{action.type}</ListItemPayload>;
    }
  }
};
