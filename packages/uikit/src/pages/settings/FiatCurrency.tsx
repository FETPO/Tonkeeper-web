import {
    FiatCurrencies,
    FiatCurrencySymbolsConfig
} from '@tonkeeper/core/dist/entries/fiat';
import React, { useMemo } from 'react';
import { CheckIcon } from '../../components/Icon';
import {
    SettingsItem,
    SettingsList
} from '../../components/settings/SettingsList';
import { SubHeader } from '../../components/SubHeader';
import { useAppContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { useMutateFiatCurrency } from '../../state/fiat';

export const FiatCurrency = () => {
  const { t } = useTranslation();

  const { fiat } = useAppContext();
  const { mutate } = useMutateFiatCurrency();

  const items = useMemo<SettingsItem[]>(() => {
    return Object.entries(FiatCurrencySymbolsConfig).map(([key, value]) => ({
      name: key,
      secondary: t(`${key}_full`),
      icon: key === fiat ? <CheckIcon /> : undefined,
      action: () => mutate(key as FiatCurrencies),
    }));
  }, [mutate, fiat]);

  return (
    <>
      <SubHeader title={t('Primary_currency')} />
      <SettingsList items={items} />
    </>
  );
};
