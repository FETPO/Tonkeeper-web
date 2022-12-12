import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { Label1 } from './Text';

export interface SettingsItem {
  name: string;
  icon: React.ReactNode;
  action: React.MouseEventHandler<HTMLDivElement>;
  danger?: boolean;
}

export interface SettingsListProps {
  items: SettingsItem[];
}

const Block = styled.div`
  display: flex;
  flex-direction: column;

  background: ${(props) => props.theme.backgroundContent};
  padding: 0 0 0 1rem;
  margin: 1rem 0 2rem;

  border-radius: ${(props) => props.theme.cornerMedium};
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 1rem 0;
  cursor: pointer;

  + * {
    border-top: 1px solid ${(props) => props.theme.separatorCommon};
  }
`;

const Icon = styled(Label1)<{ danger?: boolean }>`
  display: flex;

  ${(props) =>
    props.danger
      ? css`
          color: ${props.theme.iconSecondary};
        `
      : css`
          color: ${props.theme.accentBlue};
        `}
`;

export const SettingsList: FC<SettingsListProps> = React.memo(({ items }) => {
  return (
    <Block>
      {items.map((item) => (
        <Item key={item.name} onClick={item.action}>
          <Label1>{item.name}</Label1>
          <Icon danger={item.danger}>{item.icon}</Icon>
        </Item>
      ))}
    </Block>
  );
});
