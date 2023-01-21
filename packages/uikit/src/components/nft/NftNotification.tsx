import { NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { useNftCollectionData } from '../../state/wallet';
import { ChevronLeftIcon, EllipsisIcon } from '../Icon';
import { Body, CroppedBodyText } from '../jettons/CroppedText';
import { CloseButton, Notification, NotificationBlock } from '../Notification';
import { H2, H3, Label1 } from '../Text';
import { NftAction } from './NftAction';
import { NftDetails } from './NftDetails';
import { Image, NftBlock } from './Nfts';

const TitleBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 1rem;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.875rem 1rem;
`;

const Delimiter = styled.div`
  border-top: 1px solid ${(props) => props.theme.separatorCommon};
`;

const DelimiterExtra = styled.div`
  margin: 0 -1rem;
  width: 100%;
  border-top: 1px solid ${(props) => props.theme.separatorCommon};
`;

const CollectionTitle = styled(Label1)`
  margin-bottom: 0.5rem;
`;

const NftPreview: FC<{
  onClose: () => void;
  nftItem: NftItemRepr;
}> = ({ onClose, nftItem }) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const { t } = useTranslation();
  const { data: collection } = useNftCollectionData(nftItem);

  const { name, description } = nftItem.metadata;

  const collectionName = nftItem?.collection?.name;

  const image = nftItem.previews?.find(
    (item) => item.resolution === '1500x1500'
  );

  return (
    <NotificationBlock>
      <TitleBlock>
        <CloseButton onClick={onClose}>
          <ChevronLeftIcon />
        </CloseButton>
        {name && <H3>{name}</H3>}
        <CloseButton>
          <EllipsisIcon />
        </CloseButton>
      </TitleBlock>
      <NftBlock>
        {image && <Image ref={ref} url={image.url} />}
        <Text>
          {name && <H2>{name}</H2>}
          {collectionName && (
            <Body open margin="small">
              {collectionName}
            </Body>
          )}
          {description && (
            <CroppedBodyText text={description} margin="last" contentColor />
          )}
        </Text>
        {collection && collection.metadata.description && (
          <>
            <Delimiter />
            <Text>
              <CollectionTitle>{t('About_collection')}</CollectionTitle>
              <CroppedBodyText
                text={collection.metadata.description}
                margin="last"
                contentColor
              />
            </Text>
          </>
        )}
      </NftBlock>

      <NftAction nftItem={nftItem} kind="token" />
      <DelimiterExtra />

      <NftDetails nftItem={nftItem} />
    </NotificationBlock>
  );
};
export const NftNotification: FC<{
  nftItem: NftItemRepr | undefined;
  handleClose: () => void;
}> = ({ nftItem, handleClose }) => {
  const Content = useCallback(() => {
    if (!nftItem) return undefined;
    console.log('nftItem', nftItem);
    return <NftPreview onClose={handleClose} nftItem={nftItem} />;
  }, [nftItem, handleClose]);

  return (
    <Notification
      isOpen={nftItem != undefined}
      hideButton
      handleClose={handleClose}
    >
      {Content}
    </Notification>
  );
};
