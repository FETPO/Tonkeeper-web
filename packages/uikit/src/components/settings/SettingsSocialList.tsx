import React, { FC, useMemo } from 'react';
import { useTranslation } from '../../hooks/translation';
import {
  ContactSupportIcon,
  LegalDocumentsIcon,
  RateThisAppIcon,
  TelegramIcon,
} from './SettingsIcons';
import { SettingsItem, SettingsList } from './SettingsList';

export interface SettingsSocialProps {
  openPage: (url: string) => void;
  appPage?: string;
  onLegal: () => void;
}

export const SettingsSocialList: FC<SettingsSocialProps> = ({
  openPage,
  appPage,
  onLegal,
}) => {
  const { t } = useTranslation();
  const items = useMemo(() => {
    const result = [] as SettingsItem[];
    if (appPage) {
      result.push({
        name: t('Rate this app'),
        icon: <RateThisAppIcon />,
        action: () => openPage(appPage),
      });
    }
    return result.concat([
      {
        name: t('Contact support'),
        icon: <ContactSupportIcon />,
        action: () => openPage('mainto:support@tonkeeper.com'),
      },
      {
        name: t('Tonkeeper news'),
        icon: <TelegramIcon />,
        action: () => openPage('https://t.me/tonkeeper'),
      },
      {
        name: t('Tonkeeper discussion'),
        icon: <TelegramIcon />,
        action: () => openPage('https://t.me/tonkeeper_discuss'),
      },
      {
        name: t('Legal documents'),
        icon: <LegalDocumentsIcon />,
        action: onLegal,
      },
    ]);
  }, [t, openPage, onLegal]);

  return <SettingsList items={items} />;
};
