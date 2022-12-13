import { CheckIcon } from '@tonkeeper/uikit/dist/components/Icon';
import {
  SettingsItem,
  SettingsList,
} from '@tonkeeper/uikit/dist/components/settings/SettingsList';
import { SubHeader } from '@tonkeeper/uikit/dist/components/SubHeader';
import { useTranslation } from '@tonkeeper/uikit/dist/hooks/translation';
import { localizationSecondaryText } from '@tonkeeper/uikit/dist/libs/common';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import i18next, { languages } from '../../i18n';
import { Storage } from '../../libs/storage';

export const Localization = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const onChange = useCallback(async (lang: string) => {
    await i18next.reloadResources([lang]);
    i18next.changeLanguage(lang);
    Storage.set('lang', lang);
  }, []);

  const items = useMemo<SettingsItem[]>(() => {
    return languages.map((language) => ({
      name: language.toUpperCase(),
      secondary: localizationSecondaryText(language),
      icon: language === i18next.language ? <CheckIcon /> : undefined,
      action: () => onChange(language),
    }));
  }, [i18next.language, onChange]);

  return (
    <>
      <SubHeader onBack={() => navigate('../')} title={t('Localization')} />
      <SettingsList items={items} />
    </>
  );
};
