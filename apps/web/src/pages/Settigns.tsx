import {
  ListOfTokensIcon,
  LocalizationIcon,
  LogOutIcon,
  RecoveryPhraseIcon,
  SecurityIcon,
  SubscriptionIcon,
  ThemeIcon,
} from '@tonkeeper/uikit/dist/components/SettingsIcons';
import {
  SettingsItem,
  SettingsList,
} from '@tonkeeper/uikit/dist/components/SettingsList';
import { Title } from '@tonkeeper/uikit/dist/components/Text';
import { useTranslation } from '@tonkeeper/uikit/dist/hooks/translation';
import { FC, useMemo } from 'react';

export const Settings: FC = () => {
  const { t } = useTranslation();

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
        action: () => null,
      },
    ];
  }, [t]);

  return (
    <>
      <Title>{t('Settings')}</Title>
      <SettingsList items={mainItems} />
      <SettingsList items={secondaryItems} />
    </>
  );
};
