import React from 'react';
import styled from 'styled-components';
import { TonkeeperIcon } from './Icon';

const Block = styled.div`
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 400%;
`;

export const Loading = () => {
  return (
    <Block>
      <TonkeeperIcon />
    </Block>
  );
};
