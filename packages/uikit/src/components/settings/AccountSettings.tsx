import { walletVersionText } from '@tonkeeper/core/dist/entries/wallet';
import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { relative, SettingsRoute } from '../../libs/routes';
import { LogOutWalletNotification } from './LogOutNotification';
import {
  ListOfTokensIcon,
  LogOutIcon,
  RecoveryPhraseIcon,
  SecurityIcon,
  SubscriptionIcon,
  WalletsIcon,
} from './SettingsIcons';
import { SettingsItem, SettingsList } from './SettingsList';

const SingleAccountSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [logout, setLogout] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const wallet = useWalletContext();

  const mainItems = useMemo<SettingsItem[]>(() => {
    let items: SettingsItem[] = [
      {
        name: t('Subscriptions'),
        icon: <SubscriptionIcon />,
        action: () => navigate(relative(SettingsRoute.subscriptions)),
      },
      {
        name: t('Recovery_phrase'),
        icon: <RecoveryPhraseIcon />,
        action: () => navigate(relative(SettingsRoute.recovery)),
      },
      {
        name: t('Active_address'),
        icon: walletVersionText(wallet.active.version),
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
        action: () => navigate(relative(SettingsRoute.security)),
      },
      {
        name: t('Log_out'),
        icon: <LogOutIcon />,
        action: () => setLogout(true),
      },
    ];

    return items;
  }, [t, navigate, wallet, searchParams, setSearchParams]);

  return (
    <>
      <SettingsList items={mainItems} />
      <LogOutWalletNotification
        wallet={logout ? wallet : undefined}
        handleClose={() => setLogout(false)}
      />
    </>
  );
};

const MultipleAccountSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const wallet = useWalletContext();

  const accountItems = useMemo(() => {
    const items: SettingsItem[] = [
      {
        name: t('Manage_wallets'),
        icon: <WalletsIcon />,
        action: () => navigate(relative(SettingsRoute.account)),
      },
      {
        name: t('Subscriptions'),
        icon: <SubscriptionIcon />,
        action: () => navigate(relative(SettingsRoute.subscriptions)),
      },
    ];

    return items;
  }, [wallet, t]);

  const mainItems = useMemo<SettingsItem[]>(() => {
    const items: SettingsItem[] = [
      {
        name: t('Recovery_phrase'),
        icon: <RecoveryPhraseIcon />,
        action: () => navigate(relative(SettingsRoute.recovery)),
      },
      {
        name: t('Active_address'),
        icon: walletVersionText(wallet.active.version),
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
        action: () => navigate(relative(SettingsRoute.security)),
      },
    ];

    return items;
  }, [t, navigate, wallet]);

  return (
    <>
      <SettingsList items={accountItems} />
      <SettingsList items={mainItems} />
    </>
  );
};

export const AccountSettings = () => {
  const { account } = useAppContext();

  if (account.publicKeys.length > 1) {
    return <MultipleAccountSettings />;
  } else {
    return <SingleAccountSettings />;
  }
};
