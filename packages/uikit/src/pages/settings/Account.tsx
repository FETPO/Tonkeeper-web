import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ImportNotification } from '../../components/create/ImportNotification';
import { DropDown } from '../../components/DropDown';
import { EllipsisIcon, PlusIcon, ReorderIcon } from '../../components/Icon';
import { ColumnText, Divider } from '../../components/Layout';
import { ListBlock, ListItem, ListItemPayload } from '../../components/List';
import { SettingsList } from '../../components/settings/SettingsList';
import { SubHeader } from '../../components/SubHeader';
import { Label1 } from '../../components/Text';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Icon = styled.span`
  display: flex;
  color: ${(props) => props.theme.iconSecondary};
`;

const WalletRow: FC<{ wallet: WalletState; index: number }> = ({
  wallet,
  index,
}) => {
  const { t } = useTranslation();

  return (
    <ListItem>
      <ListItemPayload>
        <Row>
          <Icon>
            <ReorderIcon />
          </Icon>
          <ColumnText
            text={wallet.name ? wallet.name : `${t('Wallet')} ${index + 1}`}
            secondary={toShortAddress(wallet.address)}
          />
        </Row>
        <DropDown
          payload={(onClose) => (
            <ListBlock margin={false}>
              <ListItem>
                <ListItemPayload>
                  <Label1>{t('Rename')}</Label1>
                </ListItemPayload>
              </ListItem>
              <ListItem>
                <ListItemPayload>
                  <Label1>{t('Show_recovery_phrase')}</Label1>
                </ListItemPayload>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemPayload>
                  <Label1>{t('Log_out')}</Label1>
                </ListItemPayload>
              </ListItem>
              <ListItem>
                <ListItemPayload>
                  <Label1>{t('Delete_account')}</Label1>
                </ListItemPayload>
              </ListItem>
            </ListBlock>
          )}
        >
          <Icon>
            <EllipsisIcon />
          </Icon>
        </DropDown>
      </ListItemPayload>
    </ListItem>
  );
};

export const Account = () => {
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation();

  const { account } = useAppContext();
  const wallet = useWalletContext();

  const createItems = useMemo(() => {
    return [
      {
        name: t('Set_up_wallet'),
        icon: <PlusIcon />,
        action: () => setOpen(true),
      },
    ];
  }, []);

  return (
    <>
      <SubHeader title={t('Manage_wallets')} />
      <ListBlock>
        {account.wallets.map((item, index) => (
          <WalletRow key={item.address} wallet={item} index={index} />
        ))}
      </ListBlock>
      <SettingsList items={createItems} />
      <ImportNotification isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};
