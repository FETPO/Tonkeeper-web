import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { Body1, Label1 } from '../Text';

export interface SettingsItem {
  name: string;
  secondary?: string;
  action: (item: SettingsItem) => void;
  icon: React.ReactNode;
  iconColor?: string;
}

export interface SettingsListProps {
  items: SettingsItem[];
  loading?: boolean;
}

export const SettingsListBlock = styled.div`
  display: flex;
  flex-direction: column;

  background: ${(props) => props.theme.backgroundContent};
  padding: 0;
  margin: 1rem 0 2rem;

  border-radius: ${(props) => props.theme.cornerMedium};
  overflow: hidden;
`;

export const ItemPayload = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 1rem 0;
`;
export const SettingsListItem = styled.div`
  display: flex;
  padding: 0 0 0 1rem;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }

  + * ${ItemPayload} {
    border-top: 1px solid ${(props) => props.theme.separatorCommon};
  }
`;

const Icon = styled(Label1)<{ color?: string }>`
  display: flex;

  ${(props) =>
    props.color
      ? css`
          color: ${props.color};
        `
      : css`
          color: ${props.theme.accentBlue};
        `}
`;

const Secondary = styled(Body1)`
  margin-left: 0.5rem;
  color: ${(props) => props.theme.textSecondary};
`;

export const SettingsList: FC<SettingsListProps> = React.memo(
  ({ items, loading }) => {
    // TODO handle loading
    return (
      <SettingsListBlock>
        {items.map((item) => (
          <SettingsListItem key={item.name} onClick={() => item.action(item)}>
            <ItemPayload>
              <span>
                <Label1>{item.name}</Label1>
                {item.secondary && <Secondary>{item.secondary}</Secondary>}
              </span>
              <Icon color={item.iconColor}>{item.icon}</Icon>
            </ItemPayload>
          </SettingsListItem>
        ))}
      </SettingsListBlock>
    );
  }
);
