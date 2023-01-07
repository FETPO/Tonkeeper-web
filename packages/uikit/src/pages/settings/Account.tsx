import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { ImportNotification } from '../../components/create/ImportNotification';
import { DropDown } from '../../components/DropDown';
import { EllipsisIcon, ReorderIcon } from '../../components/Icon';
import { ColumnText, Divider } from '../../components/Layout';
import { ListBlock, ListItem, ListItemPayload } from '../../components/List';
import { SetUpWalletIcon } from '../../components/settings/SettingsIcons';
import { SettingsList } from '../../components/settings/SettingsList';
import { SubHeader } from '../../components/SubHeader';
import { Label1 } from '../../components/Text';
import { useAppContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { useMutateAccountState } from '../../state/account';

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Icon = styled.span`
  display: flex;
  color: ${(props) => props.theme.iconSecondary};
`;

const WalletRow: FC<{
  wallet: WalletState;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}> = ({ wallet, dragHandleProps }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  return (
    <ListItemPayload>
      <Row>
        <Icon {...dragHandleProps}>
          <ReorderIcon />
        </Icon>
        <ColumnText
          text={wallet.name ? wallet.name : t('Wallet')}
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
            <ListItem
              onClick={() => {
                searchParams.delete('logout');
                searchParams.append('logout', wallet.tonkeeperId);
                setSearchParams(searchParams);
                onClose();
              }}
            >
              <ListItemPayload>
                <Label1>{t('Log_out')}</Label1>
              </ListItemPayload>
            </ListItem>
            <ListItem
              onClick={() => {
                searchParams.delete('delete');
                searchParams.append('delete', wallet.tonkeeperId);
                setSearchParams(searchParams);
                onClose();
              }}
            >
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
  );
};

export const Account = () => {
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation();

  const { account } = useAppContext();
  const { mutate } = useMutateAccountState();

  const createItems = useMemo(() => {
    return [
      {
        name: t('Set_up_wallet'),
        icon: <SetUpWalletIcon />,
        action: () => setOpen(true),
      },
    ];
  }, []);

  const handleDrop: OnDragEndResponder = useCallback(
    (droppedItem) => {
      if (!droppedItem.destination) return;
      var updatedList = [...account.wallets];
      const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
      updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
      mutate({ activeWallet: account.activeWallet, wallets: updatedList });
    },
    [account, mutate]
  );

  return (
    <>
      <SubHeader title={t('Manage_wallets')} />
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="wallets">
          {(provided) => (
            <ListBlock {...provided.droppableProps} ref={provided.innerRef}>
              {account.wallets.map((item, index) => (
                <Draggable
                  key={item.address}
                  draggableId={item.address}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      hover={false}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <WalletRow
                        dragHandleProps={provided.dragHandleProps}
                        wallet={item}
                      />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ListBlock>
          )}
        </Droppable>
      </DragDropContext>

      <SettingsList items={createItems} />
      <ImportNotification isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};
