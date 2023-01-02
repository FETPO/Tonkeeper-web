import React, { FC } from 'react';
import styled from 'styled-components';
import { ListBlock, ListItem, ListItemPayload } from '../List';
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

const Icon = styled(Label1)`
  display: flex;
  color: ${(props) => props.theme.accentBlue};
`;

const Secondary = styled(Body1)`
  margin-left: 0.5rem;
  color: ${(props) => props.theme.textSecondary};
`;

export const SettingsList: FC<SettingsListProps> = React.memo(
  ({ items, loading }) => {
    // TODO handle loading
    return (
      <ListBlock>
        {items.map((item) => (
          <ListItem key={item.name} onClick={() => item.action(item)}>
            <ListItemPayload>
              <span>
                <Label1>{item.name}</Label1>
                {item.secondary && <Secondary>{item.secondary}</Secondary>}
              </span>
              <Icon color={item.iconColor}>{item.icon}</Icon>
            </ListItemPayload>
          </ListItem>
        ))}
      </ListBlock>
    );
  }
);
