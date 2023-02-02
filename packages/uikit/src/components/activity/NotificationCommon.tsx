import { AccountAddress } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC, PropsWithChildren, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { ListItem, ListItemPayload } from '../List';
import { NotificationBlock } from '../Notification';
import { Body1, H2, Label1 } from '../Text';

export const Title = styled(H2)`
  user-select: none;
`;

const Timestamp = styled(Body1)`
  user-select: none;
  color: ${(props) => props.theme.textSecondary};
`;

export const Label = styled(Body1)`
  user-select: none;
  color: ${(props) => props.theme.textSecondary};
`;

export const ActionDate: FC<{ kind: 'received' | 'send'; timestamp: number }> =
  ({ kind, timestamp }) => {
    const { t, i18n } = useTranslation();

    const data = useMemo(() => {
      return new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(timestamp);
    }, [timestamp, i18n.language]);

    return (
      <Timestamp>
        {kind === 'received' ? t('received_on') : t('send_on')} {data}
      </Timestamp>
    );
  };

export const ErrorActivityNotification: FC<PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation();
  return (
    <NotificationBlock>
      <Title>{children ?? t('Unknown')}</Title>
    </NotificationBlock>
  );
};

export const ActionDetailsRecipient: FC<{ recipient: AccountAddress }> = ({
  recipient,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {recipient.name && (
        <ListItem>
          <ListItemPayload>
            <Label>{t('recipient')}</Label>
            <Label1>{recipient.name}</Label1>
          </ListItemPayload>
        </ListItem>
      )}
      <ListItem>
        <ListItemPayload>
          <Label>
            {recipient.name ? t('recipient_address') : t('recipient')}
          </Label>
          <Label1>{toShortAddress(recipient.address)}</Label1>
        </ListItemPayload>
      </ListItem>
    </>
  );
};

export const ActionDetailsSender: FC<{ sender: AccountAddress }> = ({
  sender,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {sender.name && (
        <ListItem>
          <ListItemPayload>
            <Label>{t('sender')}</Label>
            <Label1>{sender.name}</Label1>
          </ListItemPayload>
        </ListItem>
      )}
      <ListItem>
        <ListItemPayload>
          <Label>{sender.name ? t('sender_address') : t('sender')}</Label>
          <Label1>{toShortAddress(sender.address)}</Label1>
        </ListItemPayload>
      </ListItem>
    </>
  );
};
