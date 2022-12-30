import {
  AccountState,
  defaultAccountState,
} from '@tonkeeper/core/dist/entries/account';
import { Network } from '@tonkeeper/core/dist/entries/network';
import {
  AuthState,
  defaultAuthState,
} from '@tonkeeper/core/dist/entries/password';
import { Configuration } from '@tonkeeper/core/dist/tonApi';
import React, { useContext } from 'react';

export const AppContext = React.createContext<{
  tonApi: Configuration;
  network: Network;
  account: AccountState;
  auth: AuthState;
}>({
  tonApi: new Configuration(),
  network: Network.MAINNET,
  account: defaultAccountState,
  auth: defaultAuthState,
});

export const useAppContext = () => {
  return useContext(AppContext);
};
