import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from '../../hooks/translation';
import { useMutateRenameWallet } from '../../state/wallet';
import { Button } from '../fields/Button';
import { Input } from '../fields/Input';
import {
  Notification,
  NotificationBlock,
  NotificationTitle,
} from '../Notification';

const RenameWalletContent: FC<{
  wallet: WalletState;
  afterClose: (action: () => void) => void;
}> = ({ afterClose, wallet }) => {
  const { t } = useTranslation();

  const { mutateAsync, isLoading, isError } = useMutateRenameWallet(wallet);

  const [name, setName] = useState(wallet.name ?? '');
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await mutateAsync(name);
    afterClose(() => null);
  };

  return (
    <NotificationBlock onSubmit={onSubmit}>
      <NotificationTitle>{t('Rename')}</NotificationTitle>

      <Input
        value={name}
        onChange={setName}
        isValid={!isError}
        label={t('Wallet_name')}
      />
      <Input
        value={wallet.active.friendlyAddress}
        disabled
        label={t('Address')}
      />

      <Button
        size="large"
        fullWith
        bottom
        primary
        loading={isLoading}
        disabled={isLoading}
        type="submit"
      >
        {t('Save')}
      </Button>
    </NotificationBlock>
  );
};

export const RenameWalletNotification: FC<{
  wallet?: WalletState;
  handleClose: () => void;
}> = ({ wallet, handleClose }) => {
  const Content = useCallback(
    (afterClose: (action: () => void) => void) => {
      if (!wallet) return undefined;
      return <RenameWalletContent wallet={wallet} afterClose={afterClose} />;
    },
    [wallet]
  );

  return (
    <Notification isOpen={wallet != null} handleClose={handleClose}>
      {Content}
    </Notification>
  );
};