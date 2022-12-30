import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthState } from '@tonkeeper/core/dist/entries/password';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { appendWallet } from '@tonkeeper/core/dist/service/accountService';
import { importWallet } from '@tonkeeper/core/dist/service/walletService';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { mnemonicNew } from 'ton-crypto';
import { Button } from '../../components/Button';
import { CreatePassword } from '../../components/create/Password';
import { Check, Worlds } from '../../components/create/Words';
import { CheckMarkIcon, GearIcon, WriteIcon } from '../../components/Icon';
import { IconPage } from '../../components/Layout';
import { useAppContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
import { useStorage } from '../../hooks/storage';
import { useTranslation } from '../../hooks/translation';
import { getAccountState } from '../../state/account';

const Blue = styled.span`
  color: ${(props) => props.theme.accentBlue};
`;

const Green = styled.span`
  color: ${(props) => props.theme.accentGreen};
`;

const useConfirmMutation = () => {
  const sdk = useAppSdk();
  const storage = useStorage();
  const { tonApi } = useAppContext();
  const client = useQueryClient();

  return useMutation<boolean, Error, { mnemonic: string[] }>(
    async ({ mnemonic }) => {
      const auth = await storage.get<AuthState>(AppKey.password);
      if (auth === null) {
        return false;
      }
      const password = await sdk.memoryStore.get<string>(AppKey.password);
      if (password === null) {
        return false;
      }

      const walletState = await importWallet(tonApi, mnemonic, password);
      const account = await getAccountState(storage);

      const update = appendWallet(account, walletState);

      await storage.set(AppKey.account, update);
      client.setQueryData([AppKey.account], update);

      return true;
    }
  );
};

const useAddWalletMutation = () => {
  const { tonApi } = useAppContext();
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, { password: string; mnemonic: string[] }>(
    async ({ password, mnemonic }) => {
      const walletState = await importWallet(tonApi, mnemonic, password);

      const account = await getAccountState(storage);

      const update = appendWallet(account, walletState);

      await storage.set(AppKey.account, update);
      client.setQueryData([AppKey.account], update);
    }
  );
};

export const Create = () => {
  const { t } = useTranslation();

  const {
    mutateAsync: checkPasswordAndCreateWalletAsync,
    isLoading: isConfirmLoading,
  } = useConfirmMutation();
  const { mutateAsync: createWalletAsync, isLoading: isCreateLoading } =
    useAddWalletMutation();

  const [mnemonic, setMnemonic] = useState<string[]>([]);

  const [create, setCreate] = useState(false);
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      mnemonicNew(24).then((value) => setMnemonic(value));
    }, 1500);
  }, []);

  useEffect(() => {
    if (mnemonic.length) {
      setTimeout(() => {
        setCreate(true);
      }, 1500);
    }
  }, [mnemonic]);

  if (mnemonic.length === 0) {
    return (
      <IconPage
        icon={
          <Blue>
            <GearIcon />
          </Blue>
        }
        title={t('Generating_wallet')}
      />
    );
  }

  if (!create) {
    return (
      <IconPage
        icon={
          <Green>
            <CheckMarkIcon />
          </Green>
        }
        title={t('Your_wallet_has_just_been_created')}
      />
    );
  }

  if (!open) {
    return (
      <IconPage
        icon={
          <Blue>
            <WriteIcon />
          </Blue>
        }
        title={t('Grab_a_pen')}
        description={t('Grab_a_pen_description')}
        button={
          <Button
            size="large"
            fullWith
            primary
            bottom
            onClick={() => setOpen(true)}
          >
            {t('Continue')}
          </Button>
        }
      />
    );
  }

  if (!check) {
    return (
      <Worlds
        mnemonic={mnemonic}
        onBack={() => setOpen(false)}
        onCheck={() => setCheck(true)}
      />
    );
  }

  if (!checked) {
    return (
      <Check
        mnemonic={mnemonic}
        onBack={() => setCheck(false)}
        onConfirm={() =>
          checkPasswordAndCreateWalletAsync({ mnemonic }).then((value) => {
            setPassword(value);
            setChecked(true);
          })
        }
        isLoading={isConfirmLoading}
      />
    );
  }

  if (!password) {
    return (
      <CreatePassword
        afterCreate={(pass) =>
          createWalletAsync({ password: pass, mnemonic }).then(() =>
            setPassword(true)
          )
        }
        isLoading={isCreateLoading}
      />
    );
  }

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
