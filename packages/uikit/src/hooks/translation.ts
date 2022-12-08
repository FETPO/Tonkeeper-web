import React, { useContext, useMemo } from 'react';

export type Translation = (text: string) => string;

export const translationContext = React.createContext<Translation>(
  (text) => text
);

export const useTranslation = () => {
  const t = useContext(translationContext);
  return useMemo(() => ({ t }), [t]);
};
