import React, { FC } from 'react';
import styled from 'styled-components';
import { H3 } from './Text';

const Block = styled.div`
  width: 300px;
  height: 200px;
  display: flex;
  justify-content: center;
  background: ${(props) => props.theme.backgroundContent};
  color: ${(props) => props.theme.textPrimary};
`;

export interface AssetProps {
  symbol: string;
}
export const Asset: FC<AssetProps> = () => {
  return (
    <Block>
      <H3>Wallet</H3>
    </Block>
  );
};
