import { useQuery } from '@tanstack/react-query';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import {
  AccountApi,
  AccountRepr,
  Configuration,
} from '@tonkeeper/core/dist/tonApi';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Action, ActionsRow } from '../../components/home/Actions';
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

export const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const wallet = useWalletContext();
  const { tonApi, fiat } = useAppContext();

  const { data, error } = useAccountInfo(tonApi, wallet.address);

  return (
    <>
      <Balance
        address={wallet.address}
        info={data}
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
    </>
  );
};
