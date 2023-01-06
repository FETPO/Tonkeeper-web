import { NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Address } from 'ton-core';
import { useTranslation } from '../../hooks/translation';
import { Button } from '../fields/Button';
import {
  Notification,
  NotificationBlock,
  NotificationTitle,
} from '../Notification';

const Input = styled.input`
  outline: none;
  border: none;

  width: 100%;
  line-height: 56px;
  border-radius: ${(props) => props.theme.cornerSmall};
  display: flex;
  padding: 0 1rem;
  box-sizing: border-box;

  font-weight: 500;
  font-size: 16px;

  color: ${(props) => props.theme.textPrimary};

  border: 1px solid ${(props) => props.theme.fieldBackground};
  background: ${(props) => props.theme.fieldBackground};

  &:focus {
    border: 1px solid ${(props) => props.theme.fieldActiveBorder};
    background: ${(props) => props.theme.fieldBackground};
  }
`;

const ButtonRow = styled.div`
  position: static;
  bottom: 0;
  width: 100%;
`;

const isValidAddress = (value: string): boolean => {
  try {
    Address.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

const NftTransferContent: FC<{
  nftItem: NftItemRepr;
  transfer: string;
  setTransfer: (value: string) => void;
}> = ({ nftItem, transfer, setTransfer }) => {
  const { t } = useTranslation();

  const isValid = isValidAddress(transfer);

  return (
    <NotificationBlock>
      <NotificationTitle>{t('Transfer_NFT')}</NotificationTitle>
      <Input
        value={transfer}
        onChange={(e) => setTransfer(e.target.value)}
        placeholder={t('Address_or_name')}
      />
      <ButtonRow>
        <Button size="large" primary fullWith disabled={!isValid}>
          {t('Continue')}
        </Button>
      </ButtonRow>
    </NotificationBlock>
  );
};

export const NftTransferNotification: FC<{ nftItem: NftItemRepr }> = ({
  nftItem,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const transfer = searchParams.get('transfer');

  const handleClose = useCallback(() => {
    searchParams.delete('transfer');
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const setTransfer = useCallback(
    (value: string) => {
      searchParams.delete('transfer');
      searchParams.append('transfer', value);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );
  const Content = useCallback(
    (afterClose: (action: () => void) => void) => {
      if (transfer === null) return;
      return (
        <NftTransferContent
          nftItem={nftItem}
          transfer={transfer}
          setTransfer={setTransfer}
        />
      );
    },
    [transfer, setTransfer, nftItem]
  );

  const isOpen = transfer !== null;

  return (
    <Notification isOpen={isOpen} handleClose={handleClose}>
      {Content}
    </Notification>
  );
};
