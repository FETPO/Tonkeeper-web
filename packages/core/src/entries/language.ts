export const languages = ['en', 'ru'] as const;

export type Language = typeof languages[number];

export const defaultLanguage: Language = 'en';

export const localizationSecondaryText = (lang: Language): string => {
  switch (lang) {
    case 'en':
      return 'English';
    case 'ru':
      return 'Русский';
  }
};
