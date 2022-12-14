import {
  DeleteAccountIcon,
  ListOfTokensIcon,
  LocalizationIcon,
  LogOutIcon,
  RecoveryPhraseIcon,
  SecurityIcon,
  SubscriptionIcon,
  ThemeIcon,
} from '@tonkeeper/uikit/dist/components/settings/SettingsIcons';
import {
  SettingsItem,
  SettingsList,
} from '@tonkeeper/uikit/dist/components/settings/SettingsList';
import { SettingsNetwork } from '@tonkeeper/uikit/dist/components/settings/SettingsNetwork';
import { SettingsSocialList } from '@tonkeeper/uikit/dist/components/settings/SettingsSocialList';

import { Title } from '@tonkeeper/uikit/dist/components/Text';
import { useTranslation } from '@tonkeeper/uikit/dist/hooks/translation';
import { relative, SettingsRoute } from '@tonkeeper/uikit/dist/libs/routes';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export const Settings: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const mainItems = useMemo<SettingsItem[]>(() => {
    return [
      {
        name: t('Subscriptions'),
        icon: <SubscriptionIcon />,
        action: () => null,
      },
      {
        name: t('Recovery phrase'),
        icon: <RecoveryPhraseIcon />,
        action: () => null,
      },
      {
        name: t('Active address'),
        icon: 'v4R2',
        action: () => null,
      },
      {
        name: t('List of tokens'),
        icon: <ListOfTokensIcon />,
        action: () => null,
      },
      {
        name: t('Security'),
        icon: <SecurityIcon />,
        action: () => null,
      },
      {
        name: t('Theme'),
        icon: <ThemeIcon />,
        action: () => null,
      },
      {
        name: t('Log out'),
        icon: <LogOutIcon />,
        action: () => null,
      },
    ];
  }, [t]);

  const secondaryItems = useMemo<SettingsItem[]>(() => {
    return [
      {
        name: t('Primary currency'),
        icon: 'USD',
        action: () => null,
      },
      {
        name: t('Localization'),
        icon: <LocalizationIcon />,
        action: () => navigate(relative(SettingsRoute.localization)),
      },
    ];
  }, [t, navigate]);

  const accountItems = useMemo(() => {
    return [
      {
        name: t('Delete account'),
        icon: <DeleteAccountIcon />,
        action: () => null,
      },
    ];
  }, [t]);

  return (
    <>
      <Title>{t('Settings')}</Title>
      <SettingsList items={mainItems} />
      <SettingsList items={secondaryItems} />
      <SettingsSocialList appPage="https://tonkeeper.com/" />
      <SettingsList items={accountItems} />
      <SettingsNetwork version={process.env.REACT_APP_VERSION} />
    </>
  );
};
