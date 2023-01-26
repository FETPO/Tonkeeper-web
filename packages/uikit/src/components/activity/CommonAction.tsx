import React, { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';
import {
  ActivityIcon,
  ReceiveIcon,
} from '../../components/activity/ActivityIcons';
import { ListItemPayload } from '../../components/List';
import { Body2, Label1 } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';

export const ListItemGrid = styled(ListItemPayload)`
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  column-gap: 1rem;
  row-gap: 0.5rem;
  overflow: hidden;
`;

const CommentMessage = styled(Body2)`
  padding: 0.5rem 0.75rem;
  background: ${(props) => props.theme.backgroundContentTint};
  border-radius: ${(props) => props.theme.cornerSmall};
  line-break: anywhere;
  display: inline-flex;
`;

const Wrapper = styled.div`
  grid-column: 2 / 4;
`;

export const Comment: FC<{ comment?: string }> = ({ comment }) => {
  if (!comment) return <></>;
  return (
    <Wrapper>
      <CommentMessage>{comment}</CommentMessage>
    </Wrapper>
  );
};

export const ErrorAction: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <ListItemGrid>
      <ActivityIcon>
        <ReceiveIcon />
      </ActivityIcon>
      <Label1>{children ?? t('Error')}</Label1>
    </ListItemGrid>
  );
};
