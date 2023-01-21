import { Action } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import {
  ActivityIcon,
  UnsubscribeIcon,
} from '../../components/activity/ActivityIcons';
import { ColumnText } from '../../components/Layout';
import { useTranslation } from '../../hooks/translation';
import { ErrorAction, ListItemGrid } from './CommonAction';

export const UnSubscribeAction: FC<{ action: Action; date: string }> = ({
  action,
  date,
}) => {
  const { t } = useTranslation();
  const { unSubscribe } = action;

  if (!unSubscribe) {
    return <ErrorAction />;
  }
  return (
    <ListItemGrid>
      <ActivityIcon>
        <UnsubscribeIcon />
      </ActivityIcon>
      <ColumnText
        text={t('Unsubscribed')}
        secondary={
          unSubscribe.beneficiary.name ??
          toShortAddress(unSubscribe.beneficiary.address)
        }
      />

      <ColumnText right noWrap text="-" secondary={date} />
    </ListItemGrid>
  );
};

export const SubscribeAction: FC<{ action: Action; date: string }> = ({
  action,
  date,
}) => {
  const { t } = useTranslation();
  const { subscribe } = action;

  if (!subscribe) {
    return <ErrorAction />;
  }

  return (
    <ListItemGrid>
      <ActivityIcon>
        <UnsubscribeIcon />
      </ActivityIcon>
      <ColumnText
        text={t('Subscribed')}
        secondary={
          subscribe.beneficiary.name ??
          toShortAddress(subscribe.beneficiary.address)
        }
      />

      <ColumnText right noWrap text="-" secondary={date} />
    </ListItemGrid>
  );
};
