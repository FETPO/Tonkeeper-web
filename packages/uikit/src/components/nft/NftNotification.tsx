import { NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  Notification,
  NotificationBlock,
  NotificationTitle,
} from '../Notification';
import { Body3, Label2 } from '../Text';
import { NftAction } from './NftAction';
import { NftDetails } from './NftDetails';
import { Image, NftBlock } from './Nfts';

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
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.parentNode!.parentNode) {
      ref.current.style.minHeight =
        (ref.current.parentNode!.parentNode as HTMLElement).offsetWidth + 'px';
      console.log(ref.current.style.minHeight);
    }
  }, [ref.current]);

  const { name, description } = nftItem.metadata;

  const collectionName = nftItem?.collection?.name;

  const image = nftItem.previews?.find(
    (item) => item.resolution === '1500x1500'
  );

  return (
    <NotificationBlock>
      {name && <NotificationTitle>{name}</NotificationTitle>}
      <NftBlock>
        {image && <Image ref={ref} src={image.url} />}
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
export const NftNotification: FC<{
  nftItem: NftItemRepr | undefined;
  handleClose: () => void;
}> = ({ nftItem, handleClose }) => {
  const Content = useCallback(
    (afterClose: (action: () => void) => void) => {
      if (!nftItem) return undefined;
      return <NftPreview afterClose={afterClose} nftItem={nftItem} />;
    },
    [nftItem]
  );

  return (
    <Notification isOpen={nftItem != undefined} handleClose={handleClose}>
      {Content}
    </Notification>
  );
};
