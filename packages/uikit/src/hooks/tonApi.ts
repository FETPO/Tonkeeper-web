import { TonApi } from '@tonkeeper/core/dist/api/Api';
import React, { useContext } from 'react';

export const TonApiContext = React.createContext<TonApi<unknown>>(new TonApi());

export const useTonApi = () => {
  return useContext(TonApiContext);
};
