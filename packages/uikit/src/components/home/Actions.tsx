import React, { FC } from 'react';
import styled from 'styled-components';
import { Label3 } from '../Text';

interface ActionProps {
  icon: React.ReactNode;
  title: string;
  action: () => void;
}

const Text = styled(Label3)`
  color: ${(props) => props.theme.textSecondary};
`;

const Block = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 55px;
  text-align: center;

  &:hover ${Text} {
    color: ${(props) => props.theme.textPrimary};
  }
`;

const Button = styled.div`
  width: 44px;
  height: 44px;
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

export const Action: FC<ActionProps> = ({ icon, title, action }) => {
  return (
    <Block onClick={action}>
      <Button>{icon}</Button>
      <Text>{title}</Text>
    </Block>
  );
};

export const ActionsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
`;
