import { formatTransferUrl } from '@tonkeeper/core/dist/utils/common';
import React, { useCallback, useState } from 'react';
import QRCode from 'react-qr-code';
import styled from 'styled-components';
import { useWalletContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { ToncoinIcon } from '../Icon';
import { Notification, NotificationBlock } from '../Notification';
import { H2, Label2 } from '../Text';
import { Action } from './Actions';
import { ReceiveIcon } from './HomeIcons';

const Icon = styled.span`
  margin-top: 1rem;
  display: inline-block;
`;
const Block = styled.div`
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  border-radius: ${(props) => props.theme.cornerMedium};
  background: ${(props) => props.theme.backgroundContent};

  max-width: 80%;
  overflow: hidden;
`;

const CopyBlock = styled(Block)`
  padding: 0;
  margin-bottom: 2rem;
`;

const TextBlock = styled.div`
  padding: 1.5rem 1.5rem 0.75rem;
  box-sizing: border-box;
`;
const CopyButton = styled.div`
  cursor: pointer;
  padding: 0.75rem 1.5rem 0.75rem;
  box-sizing: border-box;

  border-top: 1px solid ${(props) => props.theme.backgroundContentTint};
  text-align: center;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }
`;

const Background = styled.div`
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  border-radius: ${(props) => props.theme.cornerMedium};
  background: ${(props) => props.theme.textPrimary};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const Text = styled(Label2)`
  margin-bottom: 1rem;
  display: inline-block;
`;

const AddressText = styled(Label2)`
  display: inline-block;
  color: ${(props) => props.theme.textSecondary};
  word-break: break-all;
`;

const Title = styled(H2)`
  text-align: center;
`;

const ReceiveContent = () => {
  const { t } = useTranslation();
  const sdk = useAppSdk();
  const wallet = useWalletContext();

  return (
    <NotificationBlock>
      <Icon>
        <ToncoinIcon />
      </Icon>

      <Title>{t('Receive_TON_and_other_tokens')}</Title>

      <Block>
        <Text>{t('Show_QR_code_to_receive')}</Text>
        <Background>
          <QRCode
            size={400}
            value={formatTransferUrl(wallet.active.friendlyAddress)}
            strokeLinecap="round"
            strokeLinejoin="miter"
          />
        </Background>
      </Block>
      <CopyBlock>
        <TextBlock>
          <Text>{t('Or_use_wallet_address')}</Text>
          <AddressText>{wallet.active.friendlyAddress}</AddressText>
        </TextBlock>
        <CopyButton
          onClick={() => sdk.copyToClipboard(wallet.active.friendlyAddress)}
        >
          <Label2>{t('Copy')}</Label2>
        </CopyButton>
      </CopyBlock>
    </NotificationBlock>
  );
};

export const ReceiveAction = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const Content = useCallback(() => {
    if (!open) return undefined;
    return <ReceiveContent />;
  }, [open]);

  return (
    <>
      <Action
        icon={<ReceiveIcon />}
        title={t('Receive')}
        action={() => setOpen(true)}
      />
      <Notification isOpen={open} handleClose={() => setOpen(false)}>
        {Content}
      </Notification>
    </>
  );
};
