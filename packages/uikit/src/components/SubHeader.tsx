import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BackButton } from './fields/BackButton';
import { ChevronLeftIcon } from './Icon';
import { H3 } from './Text';

const Block = styled.div`
  flex-shrink: 0;

  padding: 1rem 0;

  display: flex;
  justify-content: center;
  position: relative;
`;

export const BackButtonLeft = styled(BackButton)`
  position: absolute;
  top: 50%;
  margin-top: -16px;
  left: 0;
`;

export interface SubHeaderProps {
  title: React.ReactNode;
}

const Title = styled(H3)`
  margin-top: 1px;
  margin-bottom: 2px;
`;

export const SubHeader: FC<SubHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <Block>
      <BackButtonLeft onClick={() => navigate(-1)}>
        <ChevronLeftIcon />
      </BackButtonLeft>
      <Title>{title}</Title>
    </Block>
  );
};
