import { NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Address } from 'ton-core';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { Action, ActionsRow } from '../home/Actions';
import { GlobalIcon, SendIcon } from '../home/HomeIcons';

const getMarketplaceUrl = (nftItem: NftItemRepr) => {
  const { marketplace } = nftItem.metadata;
  const address = Address.parse(nftItem.address).toString();

  switch (marketplace) {
    case 'getgems.io':
      return `https://getgems.io/nft/${address}`;
    // TODO: add more
    default:
      return `https://getgems.io/nft/${address}`;
  }
};

export const NftAction: FC<{
  kind: 'token' | 'telegram.name' | 'telegram.number' | 'ton.dns';
  nftItem: NftItemRepr;
}> = ({ kind, nftItem }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setTransfer = useCallback(() => {
    searchParams.append('transfer', '');
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const { t } = useTranslation();
  const sdk = useAppSdk();

  switch (kind) {
    case 'token': {
      return (
        <ActionsRow>
          <Action
            icon={<SendIcon />}
            title={t('Transfer_token')}
            action={setTransfer}
          />
          <Action
            icon={<GlobalIcon />}
            title={t('View_on_market')}
            action={() => sdk.openPage(getMarketplaceUrl(nftItem))}
          />
        </ActionsRow>
      );
    }
    case 'ton.dns': {
      return (
        <ActionsRow>
          <Action
            icon={<SendIcon />}
            title={t('Transfer_DNS')}
            action={setTransfer}
          />
          <Action
            icon={<GlobalIcon />}
            title={t('View_on_market')}
            action={() => null}
          />
        </ActionsRow>
      );
    }
    case 'telegram.number': {
      return (
        <ActionsRow>
          <Action
            icon={<SendIcon />}
            title={t('Transfer_number')}
            action={setTransfer}
          />
          <Action
            icon={<GlobalIcon />}
            title={t('View_on_market')}
            action={() => null}
          />
        </ActionsRow>
      );
    }
    case 'telegram.name': {
      return (
        <ActionsRow>
          <Action
            icon={<SendIcon />}
            title={t('Transfer_name')}
            action={setTransfer}
          />
          <Action
            icon={<GlobalIcon />}
            title={t('View_on_market')}
            action={() => null}
          />
        </ActionsRow>
      );
    }
  }
};
