import { Action, NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import {
  ActivityIcon,
  ContractDeployIcon,
  CreateWalletIcon,
} from '../../components/activity/ActivityIcons';
import { useTranslation } from '../../hooks/translation';
import { ColumnLayout, ErrorAction, ListItemGrid } from './CommonAction';
import { NftComment } from './NftActivity';

export const ContractDeployAction: FC<{
  action: Action;
  date: string;
  openNft: (nft: NftItemRepr) => void;
}> = ({ action, date, openNft }) => {
  const { t } = useTranslation();
  const { contractDeploy } = action;

  if (!contractDeploy) {
    return <ErrorAction />;
  }
  const interfaces = contractDeploy.interfaces ?? [];

  if (interfaces.includes('nft_item')) {
    return (
      <ListItemGrid>
        <ActivityIcon>
          <ContractDeployIcon />
        </ActivityIcon>
        <ColumnLayout
          title={t('NFT_creation')}
          entry="-"
          address={toShortAddress(contractDeploy.address)}
          date={date}
        />
        <NftComment address={contractDeploy.address} openNft={openNft} />
      </ListItemGrid>
    );
  }
  if (interfaces.includes('nft_collection')) {
    return (
      <ListItemGrid>
        <ActivityIcon>
          <ContractDeployIcon />
        </ActivityIcon>
        <ColumnLayout
          title={t('NFT_collection_creation')}
          entry="-"
          address={toShortAddress(contractDeploy.address)}
          date={date}
        />
      </ListItemGrid>
    );
  }
  if (interfaces.includes('wallet')) {
    return (
      <ListItemGrid>
        <ActivityIcon>
          <CreateWalletIcon />
        </ActivityIcon>
        <ColumnLayout
          title={t('Wallet_initialized')}
          entry="-"
          address={toShortAddress(contractDeploy.address)}
          date={date}
        />
      </ListItemGrid>
    );
  }

  console.log({ interfaces });

  return (
    <ListItemGrid>
      <ActivityIcon>
        <ContractDeployIcon />
      </ActivityIcon>
      <ColumnLayout
        title={t('Contract_Deploy')}
        entry="-"
        address={toShortAddress(contractDeploy.address)}
        date={date}
      />
    </ListItemGrid>
  );
};
