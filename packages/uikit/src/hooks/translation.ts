import {
  defaultLanguage,
  Language,
  languages,
} from '@tonkeeper/core/dist/entries/language';
import React, { useContext } from 'react';

export type Translation = (text: string) => string;

export interface I18nClient {
  enable: boolean;
  reloadResources: (langs: Language[]) => Promise<void>;
  changeLanguage: (lang: Language) => Promise<void>;
  language: Language;
  languages: Language[];
}

export interface I18nContext {
  t: Translation;
  i18n: I18nClient;
}

export const TranslationContext = React.createContext<I18nContext>({
  t: (text) => text,
  i18n: {
    enable: false,
    reloadResources: async () => {},
    changeLanguage: async () => {},
    language: defaultLanguage,
    languages: [...languages],
  },
});

export const useTranslation = () => {
  return useContext(TranslationContext);
};
