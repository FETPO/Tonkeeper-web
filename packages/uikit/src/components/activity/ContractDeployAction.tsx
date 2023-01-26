import { Action } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import {
  ActivityIcon,
  ContractDeployIcon,
  CreateWalletIcon,
} from '../../components/activity/ActivityIcons';
import { ColumnText } from '../../components/Layout';
import { useTranslation } from '../../hooks/translation';
import { ErrorAction, ListItemGrid } from './CommonAction';
import { NftComment } from './NftActivity';

export const ContractDeployAction: FC<{ action: Action; date: string }> = ({
  action,
  date,
}) => {
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
        <ColumnText
          text={t('NFT_creation')}
          secondary={toShortAddress(contractDeploy.address)}
        />
        <ColumnText right noWrap text={`-`} secondary={date} />
        <NftComment address={contractDeploy.address} />
      </ListItemGrid>
    );
  }
  if (interfaces.includes('nft_collection')) {
    return (
      <ListItemGrid>
        <ActivityIcon>
          <ContractDeployIcon />
        </ActivityIcon>
        <ColumnText
          text={t('NFT_collection_creation')}
          secondary={toShortAddress(contractDeploy.address)}
        />
        <ColumnText right noWrap text={`-`} secondary={date} />
      </ListItemGrid>
    );
  }
  if (interfaces.includes('wallet')) {
    return (
      <ListItemGrid>
        <ActivityIcon>
          <CreateWalletIcon />
        </ActivityIcon>
        <ColumnText
          text={t('Wallet_initialized')}
          secondary={toShortAddress(contractDeploy.address)}
        />
        <ColumnText right noWrap text={`-`} secondary={date} />
      </ListItemGrid>
    );
  }

  console.log({ interfaces });

  return (
    <ListItemGrid>
      <ActivityIcon>
        <ContractDeployIcon />
      </ActivityIcon>
      <ColumnText
        text={t('Contract_Deploy')}
        secondary={toShortAddress(contractDeploy.address)}
      />
      <ColumnText right noWrap text={`-`} secondary={date} />
    </ListItemGrid>
  );
};
