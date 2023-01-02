import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext, useWalletContext } from '../hooks/appContext';
import { useTranslation } from '../hooks/translation';
import { AppRoute, SettingsRoute } from '../libs/routes';
import { useMutateActiveWallet } from '../state/account';
import { ImportNotification } from './create/ImportNotification';
import { DropDown } from './DropDown';
import { CheckIcon, DownIcon, PlusIcon, SettingsIcon } from './Icon';
import { ColumnText } from './Layout';
import { ListItem, ListItemPayload } from './List';
import { Body2, H3, Label1 } from './Text';

const Block = styled.div`
  flex-shrink: 0;

  position: sticky;
  top: 0;
  padding: 1rem 0;

  display: flex;
  justify-content: center;
`;

const Title = styled(H3)`
  display: flex;
  gap: 0.5rem;
`;

const DownIconWrapper = styled.span`
  color: ${(props) => props.theme.iconSecondary};
  display: flex;
  align-items: center;
`;

const Icon = styled.span`
  color: ${(props) => props.theme.accentBlue};
  display: flex;
`;

const Row = styled.div`
  cursor: pointer;
  display: flex;
  padding: 1rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  pap: 0.25rem;
`;

const Body = styled(Body2)`
  color: ${(props) => props.theme.textSecondary};
`;

const WalletRow: FC<{
  activeWallet?: string;
  wallet: WalletState;
  index: number;
  onClose: () => void;
}> = ({ activeWallet, wallet, index, onClose }) => {
  const { mutate } = useMutateActiveWallet();
  const { t } = useTranslation();

  return (
    <ListItem
      onClick={() => {
        mutate(wallet.address);
        onClose();
      }}
    >
      <ListItemPayload>
        <ColumnText
          text={wallet.name ? wallet.name : `${t('Wallet')} ${index + 1}`}
          secondary={toShortAddress(wallet.address)}
        />
        {activeWallet === wallet.address ? (
          <Icon>
            <CheckIcon />
          </Icon>
        ) : undefined}
      </ListItemPayload>
    </ListItem>
  );
};

const Divider = styled.div`
  height: 8px;
  width: 100%;
  background: ${(props) => props.theme.backgroundOverlayExtraLight};
`;

const DropDownPayload: FC<{ onClose: () => void; onCreate: () => void }> = ({
  onClose,
  onCreate,
}) => {
  const navigate = useNavigate();
  const { account } = useAppContext();
  const { t } = useTranslation();

  if (account.wallets.length === 1) {
    return (
      <Row
        onClick={() => {
          onClose();
          onCreate();
        }}
      >
        <Label1>{t('Set_up_wallet')}</Label1>
        <Icon>
          <PlusIcon />
        </Icon>
      </Row>
    );
  } else {
    return (
      <>
        {account.wallets.map((wallet, index) => (
          <WalletRow
            key={wallet.address}
            wallet={wallet}
            activeWallet={account.activeAddress}
            index={index}
            onClose={onClose}
          />
        ))}
        <Divider />
        <Row
          onClick={() => {
            onClose();
            navigate(AppRoute.settings + SettingsRoute.account);
          }}
        >
          <Label1>{t('Manage')}</Label1>
          <Icon>
            <SettingsIcon />
          </Icon>
        </Row>
      </>
    );
  }
};

export const Header = () => {
  const { t } = useTranslation();
  const wallet = useWalletContext();
  const [isOpen, setOpen] = useState(false);
  return (
    <Block>
      <DropDown
        center
        payload={(onClose) => (
          <DropDownPayload onClose={onClose} onCreate={() => setOpen(true)} />
        )}
      >
        <Title>
          {wallet.name ? wallet.name : t('Wallet')}
          <DownIconWrapper>
            <DownIcon />
          </DownIconWrapper>
        </Title>
      </DropDown>
      <ImportNotification isOpen={isOpen} setOpen={setOpen} />
    </Block>
  );
};
