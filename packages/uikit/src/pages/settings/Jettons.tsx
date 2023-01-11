import { JettonBalance } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useCallback, useMemo } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Radio } from '../../components/fields/Checkbox';
import { ReorderIcon } from '../../components/Icon';
import { ColumnText } from '../../components/Layout';

import { ListBlock, ListItem, ListItemPayload } from '../../components/List';
import { SubHeader } from '../../components/SubHeader';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useCoinBalance } from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import {
  sortJettons,
  useJettonsBalances,
  useOrderJettonMutation,
  useToggleJettonMutation,
} from '../../state/jetton';

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
`;
const Logo = styled.img`
  width: 44px;
  height: 44px;
  border-radius: ${(props) => props.theme.cornerFull};
`;

const Icon = styled.span`
  display: flex;
  color: ${(props) => props.theme.iconSecondary};
`;

const JettonRow: FC<{
  jetton: JettonBalance;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}> = ({ jetton, dragHandleProps }) => {
  const { t } = useTranslation();
  const { fiat } = useAppContext();
  const wallet = useWalletContext();

  const { mutate, reset } = useToggleJettonMutation();

  const onChange = useCallback(() => {
    reset();
    mutate(jetton.jettonAddress);
  }, [jetton.jettonAddress]);

  const checked = useMemo(() => {
    return (wallet.hiddenJettons ?? []).every(
      (item) => item !== jetton.jettonAddress
    );
  }, [wallet]);

  const balance = useCoinBalance(
    fiat,
    jetton?.balance,
    jetton.metadata?.decimals
  );

  return (
    <ListItemPayload>
      <Row>
        <Radio checked={checked} onChange={onChange} />
        <Logo src={jetton.metadata?.image} />
        <ColumnText
          text={jetton.metadata?.name ?? t('Unknown_COIN')}
          secondary={`${balance} ${jetton.metadata?.symbol}`}
        />
      </Row>
      <Icon {...dragHandleProps}>
        <ReorderIcon />
      </Icon>
    </ListItemPayload>
  );
};

export const JettonsSettings = () => {
  const { t } = useTranslation();
  const { data } = useJettonsBalances();
  const wallet = useWalletContext();

  const jettons = useMemo(() => {
    return sortJettons(wallet.orderJettons, data?.balances ?? []);
  }, [data, wallet.orderJettons]);

  const { mutate } = useOrderJettonMutation();
  const handleDrop: OnDragEndResponder = useCallback(
    (droppedItem) => {
      if (!droppedItem.destination) return;
      var updatedList = [...jettons];
      const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
      updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
      mutate(updatedList.map((item) => item.jettonAddress));
    },
    [jettons, mutate]
  );

  return (
    <>
      <SubHeader title={t('List_of_tokens')} />
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="jettons">
          {(provided) => (
            <ListBlock {...provided.droppableProps} ref={provided.innerRef}>
              {(data?.balances ?? []).map((jetton, index) => (
                <Draggable
                  key={jetton.jettonAddress}
                  draggableId={jetton.jettonAddress}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      hover={false}
                    >
                      <JettonRow
                        dragHandleProps={provided.dragHandleProps}
                        jetton={jetton}
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
    </>
  );
};
