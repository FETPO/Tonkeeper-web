import { NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { VerificationIcon } from '../Icon';
import { Body2, Label2 } from '../Text';

const Header = styled(Label2)<{ verified?: boolean }>`
  display: inline-flex;
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;

  ${(props) =>
    props.verified &&
    css`
      padding-right: 19px;
      position: relative;
    `}
`;

const HeaderBody2 = styled(Body2)<{ verified?: boolean }>`
  display: inline-flex;
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;

  ${(props) =>
    props.verified &&
    css`
      padding-right: 19px;
      position: relative;
    `}
`;

const HeaderContent = styled.span`
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Icon = styled.span`
  position: absolute;
  top: 2px;
  right: 0;
`;

export const NftHeaderLabel2: FC<{ nft: NftItemRepr }> = React.memo(
  ({ nft }) => {
    return (
      <Header verified={nft.approvedBy && nft.approvedBy.length > 0}>
        <HeaderContent>{nft.dns ?? nft.metadata.name}</HeaderContent>
        {nft.approvedBy && (
          <Icon>
            <VerificationIcon />
          </Icon>
        )}
      </Header>
    );
  }
);

export const NftHeaderBody2: FC<{ nft: NftItemRepr }> = React.memo(
  ({ nft }) => {
    return (
      <HeaderBody2 verified={nft.approvedBy && nft.approvedBy.length > 0}>
        <HeaderContent>{nft.dns ?? nft.metadata.name}</HeaderContent>
        {nft.approvedBy && (
          <Icon>
            <VerificationIcon />
          </Icon>
        )}
      </HeaderBody2>
    );
  }
);
