import { NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useState } from 'react';
import { Address } from 'ton-core';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { Action, ActionsRow } from '../home/Actions';
import { GlobalIcon, SendIcon } from '../home/HomeIcons';
import { NftTransferNotification } from './NftTransferNotification';

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

const ActionTransfer: FC<{
  nftItem: NftItemRepr;
}> = ({ nftItem }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Action
        icon={<SendIcon />}
        title={t('Transfer_token')}
        action={() => setOpen(true)}
      />
      <NftTransferNotification
        nftItem={open ? nftItem : undefined}
        handleClose={() => setOpen(false)}
      />
    </>
  );
};
export const NftAction: FC<{
  kind: 'token' | 'telegram.name' | 'telegram.number' | 'ton.dns';
  nftItem: NftItemRepr;
}> = ({ kind, nftItem }) => {
  const { t } = useTranslation();
  const sdk = useAppSdk();

  switch (kind) {
    case 'token': {
      return (
        <ActionsRow>
          <ActionTransfer nftItem={nftItem} />
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
          <ActionTransfer nftItem={nftItem} />
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
          <ActionTransfer nftItem={nftItem} />
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
          <ActionTransfer nftItem={nftItem} />
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
