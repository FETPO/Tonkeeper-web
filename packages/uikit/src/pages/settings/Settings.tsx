import React, { FC } from 'react';
import { AccountSettings } from '../../components/settings/AccountSettings';
import { ClearSettings } from '../../components/settings/ClearSettings';
import { SettingsNetwork } from '../../components/settings/SettingsNetwork';
import { SettingsSocialList } from '../../components/settings/SettingsSocialList';
import { ThemeSettings } from '../../components/settings/ThemeSettings';
import { Title } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';

export const Settings: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Title>{t('Settings')}</Title>
      <AccountSettings />
      <ThemeSettings />
      <SettingsSocialList appPage="https://tonkeeper.com/" />
      <ClearSettings />
      <SettingsNetwork />
    </>
  );
};
