import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { ListBlock } from '../List';
import { Notification } from '../Notification';
import { H2, Label2 } from '../Text';
import { Action } from './Actions';
import { BuyItem, BuyItemNotification } from './BuyItemNotification';
import { BuyIcon } from './HomeIcons';

const buyItems: BuyItem[] = [
  {
    logo: 'https://neocrypto.net/images/logo.svg',
    title: 'Neocrypto',
    description: 'Neocrypto_description',
    termsOfUse: 'https://mercuryo.io/legal/terms/',
    privacyPolicy: 'https://mercuryo.io/legal/privacy/',
    link: 'https://neocrypto.net/en',
  },
  {
    logo: 'https://mercuryo.io/static/img/favicon/dark/apple-touch-icon.svg',
    title: 'Mercuryo',
    description: 'Mercuryo_description',
    termsOfUse: 'https://mercuryo.io/legal/terms/',
    privacyPolicy: 'https://mercuryo.io/legal/privacy/',
    link: 'https://mercuryo.io/',
  },
  {
    logo: 'https://dreamwalkers.io/uploads/favicon/favicon-64.png',
    title: 'Dreamwalkers',
    description: 'Dreamwalkers_description',
    link: 'https://dreamwalkers.io/',
  },
  {
    logo: 'https://mercuryo.io/static/img/favicon/dark/apple-touch-icon.svg',
    title: 'Wallet',
    description: 'Wallet_description',
    isBot: true,
    link: 'https://t.me/wallet',
  },
];

const sellItems: BuyItem[] = [
  {
    logo: 'https://mercuryo.io/static/img/favicon/dark/apple-touch-icon.svg',
    title: 'Mercuryo',
    description: 'Mercuryo_sell_description',
    termsOfUse: 'https://mercuryo.io/legal/terms/',
    privacyPolicy: 'https://mercuryo.io/legal/privacy/',
    link: 'https://mercuryo.io/',
  },
];

const BuyList: FC<{ items: BuyItem[]; kind: 'buy' | 'sell' }> = ({
  items,
  kind,
}) => {
  return (
    <ListBlock>
      {items.map((item) => (
        <BuyItemNotification key={item.title} item={item} kind={kind} />
      ))}
    </ListBlock>
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

export const BuyAction = () => {
  const sdk = useAppSdk();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Action
        icon={<BuyIcon />}
        title={t('Buy')}
        action={() => setOpen(true)}
      />
      <Notification isOpen={open} handleClose={() => setOpen(false)}>
        <div>
          <H2>{t('Buy_TON')}</H2>
          <BuyList items={buyItems} kind="buy" />
          <H2>{t('Sell_TON')}</H2>
          <BuyList items={sellItems} kind="sell" />
          <OtherBlock>
            <OtherLink onClick={() => sdk.openPage('https://t.me/toncoin/576')}>
              {t('Other_ways_to_buy_or_sell_TON')}
            </OtherLink>
          </OtherBlock>
        </div>
      </Notification>
    </>
  );
};
