import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { ChevronRightIcon } from '../Icon';
import { SubHeader } from '../SubHeader';
import { H3 } from '../Text';
import { SettingsItem, SettingsList } from './SettingsList';

const Icon = styled.span`
  color: ${(props) => props.theme.iconTertiary};
`;

export const SettingsLegal = React.memo(() => {
  const { t } = useTranslation();
  const sdk = useAppSdk();
  const items = useMemo<SettingsItem[]>(() => {
    return [
      {
        name: t('Terms of use'),
        icon: (
          <Icon>
            <ChevronRightIcon />
          </Icon>
        ),
        action: () => sdk.openPage('https://tonkeeper.com/terms/'),
      },
      {
        name: t('Privacy policy'),
        icon: (
          <Icon>
            <ChevronRightIcon />
          </Icon>
        ),
        action: () => sdk.openPage('https://tonkeeper.com/privacy/'),
      },
    ];
  }, [t]);

  const licenses = useMemo<SettingsItem[]>(() => {
    return [
      {
        name: t('Montserrat font'),
        icon: (
          <Icon>
            <ChevronRightIcon />
          </Icon>
        ),
        action: () => sdk.openPage('https://tonkeeper.com/privacy/'), // TODO: Update link
      },
    ];
  }, [t]);

  return (
    <>
      <SubHeader title={t('Legal')} />
      <SettingsList items={items} />
      <H3>{t('Licenses')}</H3>
      <SettingsList items={licenses} />
    </>
  );
});
