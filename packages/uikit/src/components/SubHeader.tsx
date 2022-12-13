import React, { FC } from 'react';
import styled from 'styled-components';
import { ChevronLeftIcon } from './Icon';
import { H3 } from './Text';

const Block = styled.div`
  flex-shrink: 0;

  padding: 1rem 0;

  display: flex;
  justify-content: center;
  position: relative;
`;

const BackButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 50%;
  margin-top: -14px;
  left: 0;
  width: 28px;
  height: 28px;
  border-radius: ${(props) => props.theme.cornerFull};
  color: ${(props) => props.theme.textPrimary};
  background: ${(props) => props.theme.backgroundContent};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }
`;

export interface SubHeaderProps {
  onBack: () => void;
  title: string;
}
export const SubHeader: FC<SubHeaderProps> = ({ onBack, title }) => {
  return (
    <Block>
      <BackButton onClick={onBack}>
        <ChevronLeftIcon />
      </BackButton>
      <H3>{title}</H3>
    </Block>
  );
};
