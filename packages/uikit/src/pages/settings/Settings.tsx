import React, { FC } from 'react';
import { AccountSettings } from '../../components/settings/AccountSettings';
import { ClearSettings } from '../../components/settings/ClearSettings';
import { SettingsNetwork } from '../../components/settings/SettingsNetwork';
import { SettingsSocialList } from '../../components/settings/SettingsSocialList';
import { ThemeSettings } from '../../components/settings/ThemeSettings';

const Settings: FC = () => {
  return (
    <>
      <AccountSettings />
      <ThemeSettings />
      <SettingsSocialList appPage="https://tonkeeper.com/" />
      <ClearSettings />
      <SettingsNetwork />
    </>
  );
};

export default Settings;
