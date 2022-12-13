import { Title } from '@tonkeeper/uikit/dist/components/Text';
import { useCallback } from 'react';
import i18next, { languages } from '../../i18n';
import { Storage } from '../../libs/storage';

export const Localization = () => {
  const onChange = useCallback(async (lang: string) => {
    await i18next.reloadResources([lang]);
    i18next.changeLanguage(lang);
    Storage.set('lang', lang);
  }, []);

  return (
    <>
      <Title>Localization</Title>
      {(languages ?? []).map((lang) => (
        <div key={lang} onClick={() => onChange(lang)}>
          {lang}
        </div>
      ))}
    </>
  );
};
