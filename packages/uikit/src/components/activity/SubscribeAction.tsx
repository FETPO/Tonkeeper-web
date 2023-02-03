import { Action } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import {
  ActivityIcon,
  SubscribeIcon,
  UnsubscribeIcon,
} from '../../components/activity/ActivityIcons';
import { useTranslation } from '../../hooks/translation';
import { ColumnLayout, ErrorAction, ListItemGrid } from './CommonAction';

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
      <ColumnLayout
        title={t('Unsubscribed')}
        entry="-"
        address={
          unSubscribe.beneficiary.name ??
          toShortAddress(unSubscribe.beneficiary.address)
        }
        date={date}
      />
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
        <SubscribeIcon />
      </ActivityIcon>
      <ColumnLayout
        title={t('Subscribed')}
        entry="-"
        address={
          subscribe.beneficiary.name ??
          toShortAddress(subscribe.beneficiary.address)
        }
        date={date}
      />
    </ListItemGrid>
  );
};
