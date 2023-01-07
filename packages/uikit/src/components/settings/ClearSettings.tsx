import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { DeleteAllNotification } from './LogOutNotification';
import { DeleteAccountIcon } from './SettingsIcons';
import { SettingsList } from './SettingsList';

export const ClearSettings = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { account } = useAppContext();
  const deleteItems = useMemo(() => {
    const deleteAll = () => {
      searchParams.append('notification', 'delete-all');
      setSearchParams(searchParams);
    };

    return [
      {
        name:
          account.wallets.length > 1
            ? t('Delete_all_accounts_and_logout')
            : t('Delete_account'),
        icon: <DeleteAccountIcon />,
        action: deleteAll,
      },
    ];
  }, [t, searchParams, setSearchParams]);

  return (
    <>
      <SettingsList items={deleteItems} />
      <DeleteAllNotification />
    </>
  );
};
