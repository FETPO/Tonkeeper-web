import React, { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { relative, SettingsRoute } from '../../libs/routes';
import {
  ContactSupportIcon,
  LegalDocumentsIcon,
  RateThisAppIcon,
  TelegramIcon,
} from './SettingsIcons';
import { SettingsItem, SettingsList } from './SettingsList';

export interface SettingsSocialProps {
  appPage?: string;
}

export const SettingsSocialList: FC<SettingsSocialProps> = React.memo(
  ({ appPage }) => {
    const navigate = useNavigate();
    const sdk = useAppSdk();
    const { t } = useTranslation();
    const items = useMemo(() => {
      const result = [] as SettingsItem[];
      if (appPage) {
        result.push({
          name: t('Rate this app'),
          icon: <RateThisAppIcon />,
          action: () => sdk.openPage(appPage),
        });
      }
      return result.concat([
        {
          name: t('Contact support'),
          icon: <ContactSupportIcon />,
          action: () => sdk.openPage('mailto:support@tonkeeper.com'),
        },
        {
          name: t('Tonkeeper news'),
          icon: <TelegramIcon />,
          action: () => sdk.openPage('https://t.me/tonkeeper'),
        },
        {
          name: t('Tonkeeper discussion'),
          icon: <TelegramIcon />,
          action: () => sdk.openPage('https://t.me/tonkeeper_discuss'),
        },
        {
          name: t('Legal documents'),
          icon: <LegalDocumentsIcon />,
          action: () => navigate(relative(SettingsRoute.legal)),
        },
      ]);
    }, [t, navigate, sdk.openPage]);

    return <SettingsList items={items} />;
  }
);
