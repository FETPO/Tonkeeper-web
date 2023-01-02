import { WalletVersions } from '@tonkeeper/core/dist/entries/wallet';
import { getAddress } from '@tonkeeper/core/dist/service/walletService';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { useMemo } from 'react';
import { CheckIcon } from '../../components/Icon';
import {
  SettingsItem,
  SettingsList,
} from '../../components/settings/SettingsList';
import { SubHeader } from '../../components/SubHeader';
import { useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { useMutateWalletVersion } from '../../state/account';

export const WalletVersion = () => {
  const { t } = useTranslation();

  const wallet = useWalletContext();

  const { mutate, isLoading } = useMutateWalletVersion();

  const items = useMemo<SettingsItem[]>(() => {
    const publicKey = Buffer.from(wallet.publicKey, 'hex');
    return WalletVersions.map((item) => ({
      name: item,
      secondary: toShortAddress(getAddress(publicKey, item, false)),
      icon: wallet.version === item ? <CheckIcon /> : undefined,
      action: () => mutate(item),
    }));
  }, [wallet, mutate]);

  return (
    <>
      <SubHeader title={t('Active_address')} />
      <SettingsList items={items} loading={isLoading} />
    </>
  );
};
