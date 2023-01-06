import React, { FC, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogOutNotification } from '../../components/settings/LogOutNotification';
import {
  ListOfTokensIcon,
  LocalizationIcon,
  LogOutIcon,
  RecoveryPhraseIcon,
  SecurityIcon,
  SubscriptionIcon,
  ThemeIcon,
  WalletsIcon,
} from '../../components/settings/SettingsIcons';
import {
  SettingsItem,
  SettingsList,
} from '../../components/settings/SettingsList';
import { SettingsNetwork } from '../../components/settings/SettingsNetwork';
import { SettingsSocialList } from '../../components/settings/SettingsSocialList';
import { Title } from '../../components/Text';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { relative, SettingsRoute } from '../../libs/routes';
import { useUserThemes } from '../../state/theme';
import { SettingsClear } from './SettingsClear';

const MainSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isOpen, setOpen] = useState(false);
  const wallet = useWalletContext();
  const { data: themes } = useUserThemes();

  const mainItems = useMemo<SettingsItem[]>(() => {
    const items: SettingsItem[] = [
      {
        name: t('Recovery_phrase'),
        icon: <RecoveryPhraseIcon />,
        action: () => navigate(relative(SettingsRoute.recovery)),
      },
      {
        name: t('Active_address'),
        icon: wallet.version,
        action: () => navigate(relative(SettingsRoute.version)),
      },
      {
        name: t('List_of_tokens'),
        icon: <ListOfTokensIcon />,
        action: () => navigate(relative(SettingsRoute.jettons)),
      },
      {
        name: t('Security'),
        icon: <SecurityIcon />,
        action: () => null,
      },
    ];

    if (themes && themes.length > 1) {
      items.push({
        name: t('Theme'),
        icon: <ThemeIcon />,
        action: () => navigate(relative(SettingsRoute.theme)),
      });
    }
    items.push({
      name: t('Log_out'),
      icon: <LogOutIcon />,
      action: () => setOpen(true),
    });
    return items;
  }, [t, themes, navigate, wallet]);

  return (
    <>
      <SettingsList items={mainItems} />
      <LogOutNotification isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};

export const Settings: FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { fiat, account } = useAppContext();
  const wallet = useWalletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const accountItems = useMemo(() => {
    const items: SettingsItem[] = [
      {
        name: t('Manage_wallets'),
        icon: <WalletsIcon />,
        action: () => navigate(relative(SettingsRoute.account)),
      },
    ];

    if (wallet.version === 'v4R2') {
      items.push({
        name: t('Subscriptions'),
        icon: <SubscriptionIcon />,
        action: () => null,
      });
    }

    return items;
  }, [wallet, account, t]);

  const secondaryItems = useMemo(() => {
    const items: SettingsItem[] = [
      {
        name: t('Primary_currency'),
        icon: fiat,
        action: () => navigate(relative(SettingsRoute.fiat)),
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
  }, [t, i18n.enable, navigate, fiat]);

  return (
    <>
      <Title>{t('Settings')}</Title>
      <SettingsList items={accountItems} />
      <MainSettings />
      <SettingsList items={secondaryItems} />
      <SettingsSocialList appPage="https://tonkeeper.com/" />
      <SettingsClear />
      <SettingsNetwork />
    </>
  );
};
