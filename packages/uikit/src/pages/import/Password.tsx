import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AccountState } from '@tonkeeper/core/dist/entries/account';
import { AuthState } from '@tonkeeper/core/dist/entries/password';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import {
  accountSetUpWalletState,
  getAccountState,
} from '@tonkeeper/core/dist/service/accountService';
import { IStorage } from '@tonkeeper/core/dist/Storage';
import { Configuration } from '@tonkeeper/core/dist/tonApi';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { mnemonicValidate } from 'ton-crypto';
import { CheckMarkIcon } from '../../components/Icon';
import { IconPage } from '../../components/Layout';
import { useAppContext } from '../../hooks/appContext';
import { useAfterImportAction, useAppSdk } from '../../hooks/appSdk';
import { useStorage } from '../../hooks/storage';
import { useTranslation } from '../../hooks/translation';
import { QueryKey } from '../../libs/queryKey';
import { getPasswordByNotification } from '../home/UnlockNotification';

const createWallet = async (
  client: QueryClient,
  tonApi: Configuration,
  storage: IStorage,
  mnemonic: string[],
  auth: AuthState,
  password?: string
) => {
  const key = auth.kind === 'none' ? 'none' : password;
  if (!key) {
    throw new Error('Missing encrypt password key');
  }
  await accountSetUpWalletState(storage, tonApi, mnemonic, key);

  await client.invalidateQueries([QueryKey.account]);
  return await getAccountState(storage);
};

export const useAddWalletMutation = () => {
  const sdk = useAppSdk();
  const storage = useStorage();
  const { tonApi } = useAppContext();
  const client = useQueryClient();

  return useMutation<
    false | AccountState,
    Error,
    { mnemonic: string[]; password?: string }
  >(async ({ mnemonic, password }) => {
    const valid = await mnemonicValidate(mnemonic);
    if (!valid) {
      throw new Error('Mnemonic is not valid.');
    }
    const auth = await storage.get<AuthState>(AppKey.password);
    if (auth === null) {
      return false;
    }

    if (auth.kind === 'none') {
      return await createWallet(client, tonApi, storage, mnemonic, auth);
    }

    if (!password) {
      password = await getPasswordByNotification(sdk, auth);
    }

    return await createWallet(
      client,
      tonApi,
      storage,
      mnemonic,
      auth,
      password
    );
  });
};

const Green = styled.span`
  color: ${(props) => props.theme.accentGreen};
`;

export const FinalView = () => {
  const { t } = useTranslation();
  const afterImport = useAfterImportAction();
  const client = useQueryClient();

  useEffect(() => {
    client.invalidateQueries([]);
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
