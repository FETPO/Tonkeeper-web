import { IStorage, MemoryStorage } from '@tonkeeper/core/dist/Storage';
import React, { useContext } from 'react';

export const storageContext = React.createContext<IStorage>(
  new MemoryStorage()
);

export const useStore = () => {
  return useContext(storageContext);
};
