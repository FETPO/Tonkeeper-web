import { NftItemRepr, NftItemsRepr } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Body3, Label2 } from '../Text';

const Grid = styled.div`
  display: grid;
  margin: 2rem 0;
  gap: 0.5rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

export const NftBlock = styled.div<{ hover?: boolean }>`
width: 100%:
  display: flex;
  flex-direction: column;

  background: ${(props) => props.theme.backgroundContent};

  border-radius: ${(props) => props.theme.cornerMedium};

  overflow: hidden;

  ${(props) =>
    props.hover
      ? css`
          cursor: pointer;

          &:hover {
            background: ${props.theme.backgroundContentTint};
          }
        `
      : undefined}
`;

export const Image = styled.img`
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
  color: ${(props) => props.theme.textSecondary};
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const NftItem: FC<{ nft: NftItemRepr; resolution: string }> = React.memo(
  ({ nft, resolution }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const image = nft.previews?.find((item) => item.resolution === resolution);

    const { name, description } = nft.metadata;

    const onClick = useCallback(() => {
      setSearchParams({ nft: encodeURIComponent(nft.address) });
    }, [setSearchParams]);

    return (
      <NftBlock hover onClick={onClick}>
        {image && <Image src={image.url} />}
        <Text>
          {name && <Header>{name}</Header>}
          {description && <Body>{description}</Body>}
        </Text>
      </NftBlock>
    );
  }
);

export const NftsList: FC<{ nfts: NftItemsRepr | undefined }> = ({ nfts }) => {
  return (
    <Grid>
      {(nfts?.nftItems ?? []).map((item) => (
        <NftItem key={item.address} nft={item} resolution="500x500" />
      ))}
    </Grid>
  );
};
