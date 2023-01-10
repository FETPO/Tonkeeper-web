import { useQuery } from '@tanstack/react-query';
import { Language } from '@tonkeeper/core/dist/entries/language';
import { Network } from '@tonkeeper/core/dist/entries/network';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import {
  getServerConfig,
  getStock,
  Tonendpoint,
  TonendpointConfig,
} from '@tonkeeper/core/dist/tonkeeperApi/tonendpoint';
import { useMemo } from 'react';

export const useTonendpoint = (
  build: string,
  network?: Network,
  lang?: Language
) => {
  return useMemo(() => {
    return new Tonendpoint({ build, network, lang }, {});
  }, [build, network, lang]);
};

export const useTonenpointConfig = (tonendpoint: Tonendpoint) => {
  return useQuery<TonendpointConfig, Error>(
    [AppKey.tonkeeperApi, 'config'],
    async () => {
      return getServerConfig(tonendpoint);
    }
  );
};

export const useTonenpointStock = (tonendpoint: Tonendpoint) => {
  return useQuery<TonendpointStock, Error>(
    [AppKey.tonkeeperApi, 'stock'],
    async () => {
      return getStock(tonendpoint);
    }
  );
};
