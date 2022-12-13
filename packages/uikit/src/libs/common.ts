export const sum = (a: number, b: number) => a + b;

export const localizationSecondaryText = (lang: string): string => {
  switch (lang) {
    case 'en':
      return 'English';
    case 'ru':
      return 'Русский';
    default:
      return '';
  }
};
