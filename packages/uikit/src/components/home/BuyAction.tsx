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
import { Notification } from '../Notification';
import { H2, Label2 } from '../Text';
import { Action } from './Actions';
import { BuyItemNotification } from './BuyItemNotification';
import { BuyIcon, SellIcon } from './HomeIcons';

const BuyList: FC<{ items: TonendpoinFiatItem[]; kind: 'buy' | 'sell' }> = ({
  items,
  kind,
}) => {
  return (
    <ListBlock>
      {items
        .filter((item) => !item.disabled)
        .map((item) => (
          <BuyItemNotification key={item.title} item={item} kind={kind} />
        ))}
    </ListBlock>
  );
};

const ActionNotification: FC<{
  item: TonendpoinFiatCategory;
  kind: 'buy' | 'sell';
}> = ({ item, kind }) => {
  const sdk = useAppSdk();
  const { t } = useTranslation();
  const { config } = useAppContext();
  return (
    <div>
      <H2>{item.title}</H2>
      <BuyList items={item.items} kind={kind} />
      <OtherBlock>
        <OtherLink onClick={() => sdk.openPage(config.exchangePostUrl)}>
          {t('Other_ways_to_buy_or_sell_TON')}
        </OtherLink>
      </OtherBlock>
    </div>
  );
};
const OtherBlock = styled.div`
  text-align: center;
  margin: 1rem 0;
`;

const OtherLink = styled(Label2)`
  cursor: pointer;
  color: ${(props) => props.theme.textSecondary};
`;

export const BuyAction: FC<{ buy: TonendpoinFiatCategory | undefined }> = ({
  buy,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const Content = useCallback(() => {
    if (!open || !buy) return undefined;
    return <ActionNotification item={buy} kind="buy" />;
  }, [open, buy]);
  return (
    <>
      <Action
        icon={<BuyIcon />}
        title={t('Buy')}
        action={() => setOpen(true)}
      />
      <Notification
        isOpen={open && buy != null}
        handleClose={() => setOpen(false)}
      >
        {Content}
      </Notification>
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
    return <ActionNotification item={sell} kind="sell" />;
  }, [open, sell]);
  return (
    <>
      <Action
        icon={<SellIcon />}
        title={t('Sall')}
        action={() => setOpen(true)}
      />
      <Notification
        isOpen={open && sell != null}
        handleClose={() => setOpen(false)}
      >
        {Content}
      </Notification>
    </>
  );
};
