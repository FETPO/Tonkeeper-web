import { NftItemRepr, NftItemsRepr } from '@tonkeeper/core/dist/tonApi';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Body3, Label2 } from '../Text';

const Grid = styled.div`
  display: grid;
  margin: 2rem 0;
  gap: 0.5rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;

  background: ${(props) => props.theme.backgroundContent};

  border-radius: ${(props) => props.theme.cornerMedium};

  overflow: hidden;

  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }
`;

const Image = styled.img`
  width: 100%;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  gap: 0.25rem;
  white-space: nowrap;
`;

const Header = styled(Label2)`
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Body = styled(Body3)`
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const NftItem: FC<{ nft: NftItemRepr; resolution: string }> = ({
  nft,
  resolution,
}) => {
  const image = nft.previews?.find((item) => item.resolution === resolution);

  const { name, description } = nft.metadata;
  return (
    <Block>
      {image && <Image src={image.url} />}
      <Text>
        {name && <Header>{name}</Header>}
        {description && <Body>{description}</Body>}
      </Text>
    </Block>
  );
};

export const NftsList: FC<{ nfts: NftItemsRepr | undefined }> = ({ nfts }) => {
  return (
    <Grid>
      {(nfts?.nftItems ?? []).map((item) => (
        <NftItem key={item.address} nft={item} resolution="500x500" />
      ))}
    </Grid>
  );
};
