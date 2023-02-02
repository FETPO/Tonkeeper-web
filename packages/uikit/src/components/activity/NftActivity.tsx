import { Action } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { useNftItemData } from '../../state/wallet';
import { ColumnText } from '../Layout';
import { NftNotification } from '../nft/NftNotification';
import { Body2 } from '../Text';
import { ActivityIcon, ReceiveIcon, SentIcon } from './ActivityIcons';
import { ErrorAction, ListItemGrid } from './CommonAction';

const NftBlock = styled.div`
  background: ${(props) => props.theme.backgroundContentTint};
  border-radius: ${(props) => props.theme.cornerSmall};
  overflow: hidden;
  display: inline-flex;
  cursor: pointer;
  max-width: 100%;
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

const Wrapper = styled.div`
  grid-column: 2 / 4;
`;

export const NftComment: FC<{ address: string }> = ({ address }) => {
  const { data } = useNftItemData(address);

  const [open, setOpen] = useState(false);
  if (!data) return <></>;
  const preview = data.previews?.find((item) => item.resolution === '100x100');
  return (
    <>
      <div>
        <NftNotification
          nftItem={open ? data : undefined}
          handleClose={() => setOpen(false)}
        />
      </div>
      <Wrapper>
        <NftBlock onClick={() => setOpen(true)}>
          {preview && <img height="64" width="64" src={preview.url} />}
          <NftText>
            <Body>{data.dns ?? data.metadata.name}</Body>
            <BodySecondary>
              {data.collection?.name ?? data.metadata.description}
            </BodySecondary>
          </NftText>
        </NftBlock>
      </Wrapper>
    </>
  );
};

export const NftItemTransferAction: FC<{ action: Action; date: string }> = ({
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
          secondary={
            nftItemTransfer.recipient?.name ??
            toShortAddress(
              nftItemTransfer.recipient?.address ?? nftItemTransfer.nft
            )
          }
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
        secondary={
          nftItemTransfer.sender?.name ??
          toShortAddress(nftItemTransfer.sender?.address ?? nftItemTransfer.nft)
        }
      />

      <ColumnText right noWrap text={`NFT`} secondary={date} />
      <NftComment address={nftItemTransfer.nft} />
    </ListItemGrid>
  );
};
