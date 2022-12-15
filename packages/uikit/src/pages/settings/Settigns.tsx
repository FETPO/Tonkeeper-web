import React, { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DeleteAccountIcon,
  ListOfTokensIcon,
  LocalizationIcon,
  LogOutIcon,
  RecoveryPhraseIcon,
  SecurityIcon,
  SubscriptionIcon,
  ThemeIcon,
} from '../../components/settings/SettingsIcons';
import {
  SettingsItem,
  SettingsList,
} from '../../components/settings/SettingsList';
import { SettingsNetwork } from '../../components/settings/SettingsNetwork';
import { SettingsSocialList } from '../../components/settings/SettingsSocialList';
import { Title } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';
import { relative, SettingsRoute } from '../../libs/routes';

export const Settings: FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const mainItems = useMemo<SettingsItem[]>(() => {
    return [
      {
        name: t('Subscriptions'),
        icon: <SubscriptionIcon />,
        action: () => null,
      },
      {
        name: t('Recovery_phrase'),
        icon: <RecoveryPhraseIcon />,
        action: () => null,
      },
      {
        name: t('Active_address'),
        icon: 'v4R2',
        action: () => null,
      },
      {
        name: t('List_of_tokens'),
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
        name: t('Log_out'),
        icon: <LogOutIcon />,
        action: () => null,
      },
    ];
  }, [t]);

  const secondaryItems = useMemo(() => {
    const items: SettingsItem[] = [
      {
        name: t('Primary_currency'),
        icon: 'USD',
        action: () => null,
      },
    ];

    if (i18n.enable) {
      items.push({
        name: t('Localization'),
        icon: <LocalizationIcon />,
        action: () => navigate(relative(SettingsRoute.localization)),
      });
    }
    return items;
  }, [t, i18n.enable, navigate]);

  const accountItems = useMemo(() => {
    return [
      {
        name: t('Delete_account'),
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
