import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const BackButton = styled.div`
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
  title: string;
}

export const SubHeader: FC<SubHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <Block>
      <BackButton onClick={() => navigate(-1)}>
        <ChevronLeftIcon />
      </BackButton>
      <H3>{title}</H3>
    </Block>
  );
};
