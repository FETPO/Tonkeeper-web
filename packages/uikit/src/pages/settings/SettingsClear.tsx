import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DeleteAllNotification } from '../../components/settings/LogOutNotification';
import { DeleteAccountIcon } from '../../components/settings/SettingsIcons';
import { SettingsList } from '../../components/settings/SettingsList';
import { useTranslation } from '../../hooks/translation';

export const SettingsClear = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const deleteItems = useMemo(() => {
    const deleteAll = () => {
      searchParams.append('notification', 'delete-all');
      setSearchParams(searchParams);
    };

    return [
      {
        name: t('Delete_all_accounts_and_logout'),
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
