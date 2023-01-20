import { useMutation } from '@tanstack/react-query';
import { IAppSdk } from '@tonkeeper/core/dist/AppSdk';
import { AuthState } from '@tonkeeper/core/dist/entries/password';
import { getAccountState } from '@tonkeeper/core/dist/service/accountService';
import { validateWalletMnemonic } from '@tonkeeper/core/dist/service/menmonicService';
import { getWalletState } from '@tonkeeper/core/dist/service/walletService';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/fields/Button';
import { Input } from '../../components/fields/Input';
import { TonkeeperIcon } from '../../components/Icon';
import {
  ButtonContainer,
  Notification,
  NotificationCancelButton,
} from '../../components/Notification';
import { useStorage } from '../../hooks/storage';
import { useTranslation } from '../../hooks/translation';

export const getPasswordByNotification = async (
  sdk: IAppSdk,
  auth: AuthState
): Promise<string> => {
  const id = Date.now();
  return new Promise<string>((resolve, reject) => {
    sdk.uiEvents.emit('getPassword', {
      method: 'getPassword',
      id,
      params: auth,
    });

    const onCallback = (message: {
      method: 'response';
      id?: number | undefined;
      params: string | Error;
    }) => {
      if (message.id === id) {
        const { params } = message;
        sdk.uiEvents.off('response', onCallback);

        if (typeof params === 'string') {
          resolve(params);
        } else {
          reject(params);
        }
      }
    };

    sdk.uiEvents.on('response', onCallback);
  });
};

const Block = styled.form`
  display: flex;
  flex-direction: column;
  padding: 1rem 0 3rem;
  box-sizing: border-box;

  justify-content: center;
  gap: 1rem;
  width: 100%;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 400%;

  margin-bottom: 2rem;
`;

const useMutateUnlock = (sdk: IAppSdk, requestId: number) => {
  const storage = useStorage();

  return useMutation<void, Error, string>(async (password) => {
    const account = await getAccountState(storage);
    if (account.publicKeys.length === 0) {
      throw new Error('Missing wallets');
    }
    const [publicKey] = account.publicKeys;
    const wallet = await getWalletState(storage, publicKey);
    if (!wallet) {
      throw new Error('Missing wallet');
    }

    const isValid = await validateWalletMnemonic(storage, publicKey, password);
    if (!isValid) {
      throw new Error('Mnemonic not valid');
    }

    sdk.uiEvents.emit('response', {
      method: 'response',
      id: requestId,
      params: password,
    });
  });
};

const PasswordUnlock: FC<{
  sdk: IAppSdk;
  onClose: () => void;
  requestId: number;
}> = ({ sdk, onClose, requestId }) => {
  const { t } = useTranslation();

  const ref = useRef<HTMLInputElement | null>(null);
  const { mutateAsync, isLoading, isError, reset } = useMutateUnlock(
    sdk,
    requestId
  );
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

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await mutateAsync(password);
    onClose();
  };

  const onCancel = () => {
    sdk.uiEvents.emit('response', {
      method: 'response',
      id: requestId,
      params: new Error('Cancel auth request'),
    });
    onClose();
  };

  return (
    <>
      <ButtonContainer>
        <NotificationCancelButton handleClose={onCancel} />
      </ButtonContainer>
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
    </>
  );
};

export const UnlockNotification: FC<{ sdk: IAppSdk }> = ({ sdk }) => {
  const [auth, setAuth] = useState<AuthState | undefined>(undefined);
  const [requestId, setId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handler = (options: {
      method: 'getPassword';
      id?: number | undefined;
      params: AuthState;
    }) => {
      setAuth(options.params);
      setId(options.id);
    };
    sdk.uiEvents.on('getPassword', handler);

    return () => {
      sdk.uiEvents.off('getPassword', handler);
    };
  }, [sdk]);

  const Content = useCallback(() => {
    console.log('auth', auth, 'requestId', requestId);
    if (!auth || !requestId) return undefined;
    return (
      <PasswordUnlock
        sdk={sdk}
        onClose={() => {
          setAuth(undefined);
          setId(undefined);
        }}
        requestId={requestId}
      />
    );
  }, [auth, requestId]);

  return <Notification isOpen={auth != null}>{Content}</Notification>;
};
