import {
  TonendpoinFiatCategory,
  TonendpoinFiatItem,
} from '@tonkeeper/core/dist/tonkeeperApi/tonendpoint';
import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { ListBlock } from '../List';
import { Notification, NotificationCancelButton } from '../Notification';
import { H3, Label2 } from '../Text';
import { Action } from './Actions';
import { BuyItemNotification } from './BuyItemNotification';
import { BuyIcon, SellIcon } from './HomeIcons';

const BuyList: FC<{ items: TonendpoinFiatItem[]; kind: 'buy' | 'sell' }> = ({
  items,
  kind,
}) => {
  return (
    <ListBlock margin={false}>
      {items
        .filter((item) => !item.disabled)
        .map((item) => (
          <BuyItemNotification key={item.title} item={item} kind={kind} />
        ))}
    </ListBlock>
  );
};

const TitleRow = styled.div`
  display: flex;
  gap: 1;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled(H3)`
  margin: 0;
`;

const ActionNotification: FC<{
  item: TonendpoinFiatCategory;
  kind: 'buy' | 'sell';
  handleClose: () => void;
}> = ({ item, kind, handleClose }) => {
  const sdk = useAppSdk();
  const { t } = useTranslation();
  const { config } = useAppContext();
  return (
    <div>
      <TitleRow>
        <Title>{item.title}</Title>
        <NotificationCancelButton handleClose={handleClose} />
      </TitleRow>
      <BuyList items={item.items} kind={kind} />
      <OtherBlock>
        <OtherLink onClick={() => sdk.openPage(config.exchangePostUrl!)}>
          {kind === 'buy'
            ? t('Other_ways_to_buy_TON')
            : t('Other_ways_to_sell_TON')}
        </OtherLink>
      </OtherBlock>
    </div>
  );
};
const OtherBlock = styled.div`
  text-align: center;
  margin: 1rem 0 0;
`;

const OtherLink = styled(Label2)`
  cursor: pointer;
  padding: 7.5px 1rem 8.5px;
  background: ${(props) => props.theme.backgroundContent};
  border-radius: ${(props) => props.theme.cornerSmall};
  display: inline-block;
`;

export const BuyNotification: FC<{
  buy: TonendpoinFiatCategory | undefined;
  open: boolean;
  handleClose: () => void;
}> = ({ buy, open, handleClose }) => {
  const Content = useCallback(() => {
    if (!open || !buy) return undefined;
    return (
      <ActionNotification item={buy} kind="buy" handleClose={handleClose} />
    );
  }, [open, buy]);

  return (
    <Notification
      isOpen={open && buy != null}
      handleClose={handleClose}
      hideButton
    >
      {Content}
    </Notification>
  );
};

export const BuyAction: FC<{ buy: TonendpoinFiatCategory | undefined }> = ({
  buy,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Action
        icon={<BuyIcon />}
        title={t('Buy')}
        action={() => setOpen(true)}
      />
      <BuyNotification
        buy={buy}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </>
  );
};

export const SellAction: FC<{ sell: TonendpoinFiatCategory | undefined }> = ({
  sell,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const Content = useCallback(() => {
    if (!open || !sell) return undefined;
    return (
      <ActionNotification
        item={sell}
        kind="sell"
        handleClose={() => setOpen(false)}
      />
    );
  }, [open, sell]);
  return (
    <>
      <Action
        icon={<SellIcon />}
        title={t('Sell')}
        action={() => setOpen(true)}
      />
      <Notification
        isOpen={open && sell != null}
        handleClose={() => setOpen(false)}
        hideButton
      >
        {Content}
      </Notification>
    </>
  );
};
