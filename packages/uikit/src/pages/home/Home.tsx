import { useQuery } from '@tanstack/react-query';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import {
  AccountApi,
  AccountRepr,
  Configuration,
  JettonApi,
  JettonsBalances,
} from '@tonkeeper/core/dist/tonApi';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Action, ActionsRow } from '../../components/home/Actions';
import { Assets } from '../../components/home/Assets';
import { Balance } from '../../components/home/Balance';
import { BuyAction } from '../../components/home/BuyAction';
import { ReceiveIcon, SendIcon } from '../../components/home/HomeIcons';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';

const useAccountInfo = (tonApi: Configuration, account: string) => {
  return useQuery<AccountRepr, Error>([account, AppKey.balance], async () => {
    return await new AccountApi(tonApi).getAccountInfo({ account });
  });
};

const useJettonsInfo = (tonApi: Configuration, account: string) => {
  return useQuery<JettonsBalances, Error>(
    [account, AppKey.jettions],
    async () => {
      return await new JettonApi(tonApi).getJettonsBalances({ account });
    }
  );
};

export const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const wallet = useWalletContext();
  const { tonApi, fiat } = useAppContext();

  const { data: info, error } = useAccountInfo(tonApi, wallet.address);
  const { data: jettons } = useJettonsInfo(tonApi, wallet.address);

  return (
    <>
      <Balance
        address={wallet.address}
        info={info}
        error={error}
        currency={fiat}
      />
      <ActionsRow>
        <BuyAction />
        <Action icon={<SendIcon />} title={t('Send')} action={() => null} />
        <Action
          icon={<ReceiveIcon />}
          title={t('Receive')}
          action={() => null}
        />
      </ActionsRow>
      <Assets info={info} jettons={jettons} />
    </>
  );
};
