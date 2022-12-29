import { Configuration } from '@tonkeeper/core/dist/tonApi';
import React, { useContext } from 'react';

export const TonApiContext = React.createContext<Configuration>(
  new Configuration()
);

export const useTonApi = () => {
  return useContext(TonApiContext);
};
