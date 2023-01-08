import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { Body2, H2, Label1 } from './Text';

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

const Text = styled.div<{ right?: boolean }>`
  display: flex;
  flex-direction: column;
  pap: 0.25rem;
  ${(props) =>
    props.right
      ? css`
          text-align: right;
        `
      : undefined}
`;

const Label = styled(Label1)<{ green?: boolean }>`
  ${(props) =>
    props.green
      ? css`
          color: ${props.theme.accentGreen};
        `
      : undefined}
`;

const Secondary = styled(Body2)`
  color: ${(props) => props.theme.textSecondary};
`;

export const ColumnText: FC<{
  green?: boolean;
  right?: boolean;
  text: string;
  secondary: string;
}> = ({ green, text, secondary, right }) => {
  return (
    <Text right={right}>
      <Label green={green}>{text}</Label>
      <Secondary>{secondary}</Secondary>
    </Text>
  );
};

export const Divider = styled.div`
  height: 8px;
  width: 100%;
  background: ${(props) => props.theme.backgroundOverlayExtraLight};
`;
