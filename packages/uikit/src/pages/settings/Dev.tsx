import { switchNetwork } from '@tonkeeper/core/dist/entries/network';
import React, { useMemo } from 'react';
import {
  SettingsItem,
  SettingsList,
} from '../../components/settings/SettingsList';
import { SubHeader } from '../../components/SubHeader';
import { useAppContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { useMutateNetwork } from '../../state/network';

export const DevSettings = React.memo(() => {
  const { t } = useTranslation();

  const { network } = useAppContext();
  const { mutate } = useMutateNetwork();

  const items = useMemo<SettingsItem[]>(() => {
    return [
      {
        name: t('Network'),
        icon: network,
        action: () => network && mutate(switchNetwork(network)),
      },
    ];
  }, [t, network]);

  return (
    <>
      <SubHeader title={t('Dev')} />
      <SettingsList items={items} />
    </>
  );
});
