import { AccountEvent, Action } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useCallback } from 'react';
import { Notification } from '../Notification';
import {
  JettonTransferActionNotification,
  TonTransferActionNotification,
} from './ActivityActionDetails';
import { ContractDeployActionDetails } from './ContractDeployAction';
import { ErrorActivityNotification } from './NotificationCommon';

export interface ActionData {
  action: Action;
  timestamp: number;
  event: AccountEvent;
}

const ActivityContent: FC<ActionData> = (props) => {
  switch (props.action.type) {
    case 'TonTransfer':
      return <TonTransferActionNotification {...props} />;
    case 'JettonTransfer':
      return <JettonTransferActionNotification {...props} />;
    case 'NftItemTransfer':
    case 'ContractDeploy':
      return <ContractDeployActionDetails {...props} />;
    case 'UnSubscribe':
    case 'Subscribe':
    case 'AuctionBid':
    case 'Unknown':
      return <ErrorActivityNotification />;
    default: {
      console.log(props);
      return (
        <ErrorActivityNotification>
          {props.action.type}
        </ErrorActivityNotification>
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
