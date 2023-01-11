import { useMutation } from '@tanstack/react-query';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { decrypt } from '@tonkeeper/core/dist/service/cryptoService';
import { getWalletState } from '@tonkeeper/core/dist/service/walletService';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { mnemonicValidate } from 'ton-crypto';
import { Button } from '../../components/fields/Button';
import { Input } from '../../components/fields/Input';
import { TonkeeperIcon } from '../../components/Icon';
import { useAppContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
import { useStorage } from '../../hooks/storage';
import { useTranslation } from '../../hooks/translation';

const Block = styled.form`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem 0;
  box-sizing: border-box;

  justify-content: center;
  gap: 1rem;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 400%;

  margin-bottom: 2rem;
`;

const useMutateUnlock = () => {
  const { account } = useAppContext();
  const sdk = useAppSdk();
  const storage = useStorage();

  return useMutation<void, Error, string>(async (password) => {
    if (account.publicKeys.length === 0) {
      throw new Error('Missing wallets');
    }
    const [publicKey] = account.publicKeys;
    const wallet = await getWalletState(storage, publicKey);
    if (!wallet) {
      throw new Error('Missing wallet');
    }
    const mnemonic = await decrypt(wallet.mnemonic, password);
    const isValid = await mnemonicValidate(mnemonic.split(' '));
    if (!isValid) {
      throw new Error('Invalid password');
    }

    await sdk.memoryStore.set(AppKey.password, password);
    sdk.uiEvents.emit('unlock');
  });
};

export const PasswordUnlock = () => {
  const { t } = useTranslation();

  const ref = useRef<HTMLInputElement | null>(null);
  const { mutate, isLoading, isError, reset } = useMutateUnlock();
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);

  const onChange = (value: string) => {
    reset();
    setPassword(value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    mutate(password);
  };

  return (
    <Block onSubmit={onSubmit}>
      <Logo>
        <TonkeeperIcon />
      </Logo>
      <Input
        ref={ref}
        value={password}
        onChange={onChange}
        type="password"
        label={t('Password')}
        isValid={!isError}
        disabled={isLoading}
      />
      <Button size="large" primary fullWith type="submit" loading={isLoading}>
        {t('Unlock')}
      </Button>
    </Block>
  );
};
export const Unlock = () => {
  const { auth } = useAppContext();

  if (auth.kind === 'password') {
    return <PasswordUnlock />;
  } else {
    return <div>Other auth</div>;
  }
};
