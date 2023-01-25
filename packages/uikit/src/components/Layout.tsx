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
  gap: 0.75rem;
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
    <Block>
      {icon}
      <div>
        {title && <H2>{title}</H2>}
        {description && <Body>{description}</Body>}
      </div>
      {button}
    </Block>
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

const Label = styled(Label1)<{ green?: boolean; noWrap?: boolean }>`
  ${(props) =>
    props.green
      ? css`
          color: ${props.theme.accentGreen};
        `
      : undefined}

  ${(props) =>
    props.noWrap
      ? css`
          white-space: nowrap;
        `
      : undefined}
`;

const Secondary = styled(Body2)<{ noWrap?: boolean }>`
  color: ${(props) => props.theme.textSecondary};
  ${(props) =>
    props.noWrap
      ? css`
          white-space: nowrap;
        `
      : undefined}
`;

export const ColumnText: FC<{
  green?: boolean;
  right?: boolean;
  noWrap?: boolean;
  text: React.ReactNode;
  secondary: React.ReactNode;
}> = ({ green, text, secondary, right, noWrap }) => {
  return (
    <Text right={right}>
      <Label green={green} noWrap={noWrap}>
        {text}
      </Label>
      <Secondary noWrap={noWrap}>{secondary}</Secondary>
    </Text>
  );
};

export const Divider = styled.div`
  height: 8px;
  width: 100%;
  background: ${(props) => props.theme.backgroundContent};
`;
