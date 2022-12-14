import {
  Language,
  languages,
  localizationSecondaryText,
} from '@tonkeeper/core/dist/entries/language';
import { CheckIcon } from '@tonkeeper/uikit/dist/components/Icon';
import {
  SettingsItem,
  SettingsList,
} from '@tonkeeper/uikit/dist/components/settings/SettingsList';
import { SubHeader } from '@tonkeeper/uikit/dist/components/SubHeader';
import { useTranslation } from '@tonkeeper/uikit/dist/hooks/translation';
import { useMutateLanguage } from '@tonkeeper/uikit/dist/state/language';
import { useCallback, useMemo } from 'react';
import i18next from '../../i18n';

export const Localization = () => {
  const { t } = useTranslation();
  const { mutateAsync } = useMutateLanguage();
  const onChange = useCallback(
    async (lang: Language) => {
      await i18next.reloadResources([lang]);
      await i18next.changeLanguage(lang);
      await mutateAsync(lang);
    },
    [mutateAsync]
  );

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
      <SubHeader title={t('Localization')} />
      <SettingsList items={items} />
    </>
  );
};
