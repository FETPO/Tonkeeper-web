import { useQuery } from '@tanstack/react-query';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import {
  AccountApi,
  AccountRepr,
  Configuration,
} from '@tonkeeper/core/dist/tonApi';
import React from 'react';
import { Balance } from '../../components/home/Balance';
import { useAppContext, useWalletContext } from '../../hooks/appContext';

const useAccountInfo = (tonApi: Configuration, account: string) => {
  return useQuery<AccountRepr, Error>([account, AppKey.balance], async () => {
    return await new AccountApi(tonApi).getAccountInfo({ account });
  });
};

export const Home = () => {
  const wallet = useWalletContext();
  const { tonApi, fiat } = useAppContext();

  const { data, error } = useAccountInfo(tonApi, wallet.address);

  return (
    <Balance
      address={wallet.address}
      info={data}
      error={error}
      currency={fiat}
    />
  );
};
