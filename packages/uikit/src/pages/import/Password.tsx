import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthState } from '@tonkeeper/core/dist/entries/password';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { appendWallet } from '@tonkeeper/core/dist/service/accountService';
import { importWallet } from '@tonkeeper/core/dist/service/walletService';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { mnemonicValidate } from 'ton-crypto';
import { CheckMarkIcon } from '../../components/Icon';
import { IconPage } from '../../components/Layout';
import { useAppContext } from '../../hooks/appContext';
import { useAfterImportAction, useAppSdk } from '../../hooks/appSdk';
import { useStorage } from '../../hooks/storage';
import { useTranslation } from '../../hooks/translation';
import { getAccountState } from '../../state/account';

export const useConfirmMutation = () => {
  const { t } = useTranslation();
  const sdk = useAppSdk();
  const storage = useStorage();
  const { tonApi } = useAppContext();
  const client = useQueryClient();

  return useMutation<boolean, Error, { mnemonic: string[] }>(
    async ({ mnemonic }) => {
      const valid = await mnemonicValidate(mnemonic);
      if (!valid) {
        throw new Error('Mnemonic is not valid.');
      }
      const auth = await storage.get<AuthState>(AppKey.password);
      if (auth === null) {
        return false;
      }
      const password = await sdk.memoryStore.get<string>(AppKey.password);
      if (password === null) {
        return false;
      }

      const account = await getAccountState(storage);
      const name = `${t('Wallet')} ${account.wallets.length + 1}`;
      const walletState = await importWallet(tonApi, mnemonic, password, name);

      const update = appendWallet(account, walletState);

      await storage.set(AppKey.account, update);
      await client.invalidateQueries([AppKey.account]);

      return true;
    }
  );
};

export const useAddWalletMutation = () => {
  const { t } = useTranslation();
  const { tonApi } = useAppContext();
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, { password: string; mnemonic: string[] }>(
    async ({ password, mnemonic }) => {
      const valid = await mnemonicValidate(mnemonic);
      if (!valid) {
        throw new Error('Mnemonic is not valid.');
      }

      const account = await getAccountState(storage);
      const name = `${t('Wallet')} ${account.wallets.length + 1}`;

      const walletState = await importWallet(tonApi, mnemonic, password, name);

      const update = appendWallet(account, walletState);

      await storage.set(AppKey.account, update);
      await client.invalidateQueries([AppKey.account]);
    }
  );
};

const Green = styled.span`
  color: ${(props) => props.theme.accentGreen};
`;

export const FinalView = () => {
  const { t } = useTranslation();
  const afterImport = useAfterImportAction();

  useEffect(() => {
    setTimeout(afterImport, 3000);
  }, []);

  return (
    <IconPage
      icon={
        <Green>
          <CheckMarkIcon />
        </Green>
      }
      title={t('Congratulations_You_ve_set_up_your_wallet')}
    />
  );
};
