import { useMutation } from '@tanstack/react-query';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { decrypt } from '@tonkeeper/core/dist/service/cryptoService';
import React, { useState } from 'react';
import styled from 'styled-components';
import { mnemonicValidate } from 'ton-crypto';
import { Button } from '../../components/fields/Button';
import { Input } from '../../components/fields/Input';
import { TonkeeperIcon } from '../../components/Icon';
import { useAppContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';

const Block = styled.form`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem 0;
  box-sizing: border-box;

  justify-content: center;
  gap: 3rem;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 400%;
`;

const useMutateUnlock = () => {
  const { account } = useAppContext();
  const sdk = useAppSdk();

  return useMutation<void, Error, string>(async (password) => {
    if (account.wallets.length === 0) {
      throw new Error('Missing wallets');
    }
    const [wallet] = account.wallets;

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

  const { mutate, isLoading, isError, reset } = useMutateUnlock();
  const [password, setPassword] = useState('');

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
