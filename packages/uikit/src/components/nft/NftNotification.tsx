import { NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { useNftInfo } from '../../state/nft';
import {
  Notification,
  NotificationBlock,
  NotificationTitle,
} from '../Notification';
import { Body3, Label2 } from '../Text';
import { NftAction } from './NftAction';
import { NftDetails } from './NftDetails';
import { Image, NftBlock } from './Nfts';
import { NftTransferNotification } from './NftTransferNotification';

const Text = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  gap: 0.5rem;
`;

const Body = styled(Body3)`
  color: ${(props) => props.theme.textSecondary};
`;

const NftPreview: FC<{
  afterClose: (action: () => void) => void;
  nftItem: NftItemRepr;
}> = ({ afterClose, nftItem }) => {
  const { t } = useTranslation();
  console.log(nftItem);

  const { name, description } = nftItem.metadata;

  const collectionName = nftItem?.collection?.name;

  const image = nftItem.previews?.find(
    (item) => item.resolution === '1500x1500'
  );

  return (
    <NotificationBlock>
      {name && <NotificationTitle>{name}</NotificationTitle>}
      <NftBlock>
        {image && <Image src={image.url} />}
        <Text>
          {name && <Label2>{name}</Label2>}
          {collectionName && <Body>{collectionName}</Body>}
          {description && <Body>{description}</Body>}
        </Text>
      </NftBlock>

      <NftAction nftItem={nftItem} kind="token" />

      <NftDetails nftItem={nftItem} />
    </NotificationBlock>
  );
};
export const NftNotification = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: items } = useNftInfo();
  const address = useMemo(() => {
    const nft = searchParams.get('nft');
    return nft ? decodeURIComponent(nft) : undefined;
  }, [searchParams.get('nft')]);

  const handleClose = useCallback(() => {
    searchParams.delete('nft');
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const nftItem = useMemo(() => {
    if (!address || !items) return undefined;
    return items.nftItems.find((item) => item.address === address);
  }, [address, items]);

  const isOpen = nftItem != undefined;

  const Content = useCallback(
    (afterClose: (action: () => void) => void) => {
      if (!nftItem) return undefined;
      return (
        <>
          <NftPreview afterClose={afterClose} nftItem={nftItem} />
          <NftTransferNotification nftItem={nftItem} />
        </>
      );
    },
    [nftItem]
  );

  return (
    <Notification isOpen={isOpen} handleClose={handleClose}>
      {Content}
    </Notification>
  );
};
