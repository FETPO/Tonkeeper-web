import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Address } from 'ton-core';
import { useAppContext } from '../../hooks/appContext';
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
        value={Address.parse(wallet.address).toString()}
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

export const RenameWalletNotification = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { account } = useAppContext();

  const tonkeeperId = useMemo(() => {
    return searchParams.get('rename');
  }, [searchParams]);

  const handleClose = useCallback(() => {
    searchParams.delete('rename');
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const isOpen = tonkeeperId != null;

  const Content = useCallback(
    (afterClose: (action: () => void) => void) => {
      if (!tonkeeperId) return undefined;
      const wallet = account.wallets.find(
        (item) => item.tonkeeperId === tonkeeperId
      );
      if (!wallet) return undefined;
      return <RenameWalletContent wallet={wallet} afterClose={afterClose} />;
    },
    [tonkeeperId]
  );

  return (
    <Notification isOpen={isOpen} handleClose={handleClose}>
      {Content}
    </Notification>
  );
};
