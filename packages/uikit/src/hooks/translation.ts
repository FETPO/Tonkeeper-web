import React, { useContext, useMemo } from 'react';

export type Translation = (text: string) => string;

export const TranslationContext = React.createContext<Translation>(
  (text) => text
);

export const useTranslation = () => {
  const t = useContext(TranslationContext);
  return useMemo(() => ({ t }), [t]);
};
