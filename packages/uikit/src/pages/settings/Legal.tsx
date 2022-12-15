import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ChevronRightIcon } from '../../components/Icon';
import {
  SettingsItem,
  SettingsList,
} from '../../components/settings/SettingsList';
import { SubHeader } from '../../components/SubHeader';
import { H3 } from '../../components/Text';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';

const Icon = styled.span`
  display: flex;
  color: ${(props) => props.theme.iconTertiary};
`;

export const Legal = React.memo(() => {
  const { t } = useTranslation();
  const sdk = useAppSdk();
  const items = useMemo<SettingsItem[]>(() => {
    return [
      {
        name: t('Terms_of_use'),
        icon: (
          <Icon>
            <ChevronRightIcon />
          </Icon>
        ),
        action: () => sdk.openPage('https://tonkeeper.com/terms/'),
      },
      {
        name: t('Privacy_policy'),
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
        name: t('Montserrat_font'),
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
