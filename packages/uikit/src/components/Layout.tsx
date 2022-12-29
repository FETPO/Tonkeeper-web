import React, { FC } from 'react';
import styled from 'styled-components';
import { Body2, H2 } from './Text';

export const Gap = styled.div`
  flex-grow: 1;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
`;

const Body = styled(Body2)`
  color: ${(props) => props.theme.textSecondary};
`;

export const IconPage: FC<{
  icon: React.ReactNode;
  title?: string;
  description?: string;
  button?: React.ReactNode;
}> = ({ icon, title, description, button }) => {
  return (
    <>
      <Block>
        {icon}
        {title && <H2>{title}</H2>}
        {description && <Body>{description}</Body>}
      </Block>
      {button}
    </>
  );
};
