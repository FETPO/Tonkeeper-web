import { AccountEvent, Action } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useCallback } from 'react';
import { useTranslation } from '../../hooks/translation';
import { Notification } from '../Notification';
import {
  JettonTransferActionNotification,
  TonTransferActionNotification,
} from './ActivityActionDetails';
import { ErrorActivityNotification } from './NotificationCommon';

export interface ActionData {
  action: Action;
  timestamp: number;
  event: AccountEvent;
}

const ActivityContent: FC<ActionData> = ({ action, timestamp, event }) => {
  const { t } = useTranslation();
  switch (action.type) {
    case 'TonTransfer':
      return (
        <TonTransferActionNotification
          action={action}
          timestamp={timestamp}
          event={event}
        />
      );
    case 'JettonTransfer':
      return (
        <JettonTransferActionNotification
          action={action}
          timestamp={timestamp}
          event={event}
        />
      );
    case 'NftItemTransfer':
    case 'ContractDeploy':
    case 'UnSubscribe':
    case 'Subscribe':
    case 'AuctionBid':
    case 'Unknown':
      return <ErrorActivityNotification />;
    default: {
      console.log(action);
      return (
        <ErrorActivityNotification>{action.type}</ErrorActivityNotification>
      );
    }
  }
};

export const ActivityNotification: FC<{
  value: ActionData | undefined;
  handleClose: () => void;
}> = ({ value, handleClose }) => {
  const Content = useCallback(() => {
    if (!value) return undefined;
    return (
      <ActivityContent
        action={value.action}
        timestamp={value.timestamp}
        event={value.event}
      />
    );
  }, [value, handleClose]);

  return (
    <Notification isOpen={value != undefined} handleClose={handleClose}>
      {Content}
    </Notification>
  );
};
