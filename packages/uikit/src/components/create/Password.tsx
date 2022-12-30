import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthPassword } from '@tonkeeper/core/dist/entries/password';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAppSdk } from '../../hooks/appSdk';
import { useStorage } from '../../hooks/storage';
import { useTranslation } from '../../hooks/translation';
import { Button } from '../Button';
import { H2 } from '../Text';

const Block = styled.div`
  display: flex;
  text-align: center;
  gap: 1rem;
  flex-direction: column;
`;

const InputBlock = styled.label<{ active: boolean; valid: boolean }>`
  width: 100%;
  line-height: 56px;
  border-radius: ${(props) => props.theme.cornerSmall};
  display: flex;
  padding: 0 1rem;
  gap: 0.5rem;
  box-sizing: border-box;

  ${(props) =>
    props.active
      ? css`
          border: 1px solid ${props.theme.fieldActiveBorder};
          background: ${props.theme.fieldBackground};
        `
      : !props.valid
      ? css`
          border: 1px solid ${props.theme.fieldErrorBorder};
          background: ${props.theme.fieldErrorBackground};
        `
      : css`
          border: 1px solid ${props.theme.fieldBackground};
          background: ${props.theme.fieldBackground};
        `}
`;

const Input = styled.input`
  outline: none;
  border: none;
  background: transparent;
  flex-grow: 1;
  font-weight: 500;
  font-size: 16px;
  line-height: 56px;

  color: ${(props) => props.theme.textPrimary};
`;

const useCreatePassword = () => {
  const storage = useStorage();
  const sdk = useAppSdk();
  const client = useQueryClient();

  return useMutation<string, Error, string>(async (password) => {
    await sdk.memoryStore.set(AppKey.password, password);
    const state: AuthPassword = {
      kind: 'password',
    };
    await storage.set(AppKey.password, state);
    client.setQueryData([AppKey.password], state);
    return password;
  });
};

const PasswordInput: FC<{
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
}> = ({ value, onChange, isValid }) => {
  const [active, setActive] = useState(false);

  return (
    <InputBlock active={active} valid={active || isValid}>
      <Input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      />
    </InputBlock>
  );
};

export const CreatePassword: FC<{
  afterCreate: (password: string) => void;
  isLoading?: boolean;
}> = ({ afterCreate, isLoading }) => {
  const { mutateAsync, isLoading: isCreating } = useCreatePassword();
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const onCreate = async () => {
    await mutateAsync(password);
    afterCreate(password);
  };

  const isPasswordValid = password.length > 5;
  const isConfirmValid = !isPasswordValid || password === confirm;

  return (
    <>
      <Block>
        <H2>{t('Create_password')}</H2>
        <PasswordInput
          value={password}
          onChange={setPassword}
          isValid={isPasswordValid}
        />
        <PasswordInput
          value={confirm}
          onChange={setConfirm}
          isValid={isConfirmValid}
        />
      </Block>

      <Button
        size="large"
        fullWith
        primary
        loading={isLoading || isCreating}
        disabled={!isPasswordValid || !isConfirmValid}
        onClick={onCreate}
      >
        {t('Continue')}
      </Button>
    </>
  );
};
