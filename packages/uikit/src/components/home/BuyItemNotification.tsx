import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiatCurrencies } from '@tonkeeper/core/dist/entries/fiat';
import { WalletState } from '@tonkeeper/core/dist/entries/wallet';
import {
  TonendpoinFiatButton,
  TonendpoinFiatItem,
  TonendpointConfig,
} from '@tonkeeper/core/dist/tonkeeperApi/tonendpoint';
import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useAppSdk } from '../../hooks/appSdk';
import { useStorage } from '../../hooks/storage';
import { useTranslation } from '../../hooks/translation';
import { Button } from '../fields/Button';
import { Checkbox } from '../fields/Checkbox';
import { ChevronRightIcon } from '../Icon';
import { ListItem, ListItemPayload } from '../List';
import { Notification } from '../Notification';
import { Body2, H2, Label1, Label2 } from '../Text';

const Logo = styled.img<{ large?: boolean }>`
  ${(props) =>
    props.large
      ? css`
          width: 60px;
          height: 60px;
        `
      : css`
          width: 40px;
          height: 40px;
        `}

  border-radius: ${(props) => props.theme.cornerFull};
`;

const Description = styled.div`
  display: flex;
  gap: 1rem;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Body = styled(Body2)`
  color: ${(props) => props.theme.textSecondary};
`;

const Icon = styled.div`
  display: flex;
  color: ${(props) => props.theme.iconTertiary};
`;

const NotificationBlock = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  align-items: center;
`;

const CheckboxBlock = styled.span`
  margin: 1rem 0;
  display: flex;
`;
export const DisclaimerBlock = styled.div`
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  width: 100%;

  background: ${(props) => props.theme.backgroundContent};
  border-radius: ${(props) => props.theme.cornerSmall};
`;

export const DisclaimerText = styled(Label2)`
  display: block;
`;

const DisclaimerLink = styled(Label2)`
  cursor: pointer;
  color: ${(props) => props.theme.textSecondary};
  margin-right: 1rem;
`;

const Disclaimer: FC<{
  buttons: TonendpoinFiatButton[];
}> = ({ buttons }) => {
  const { t } = useTranslation();
  const sdk = useAppSdk();

  return (
    <DisclaimerBlock>
      <DisclaimerText>{t('You_are_opening_an_external_app')}</DisclaimerText>
      {buttons && buttons.length > 0 && (
        <div>
          {buttons.map((button, index) => (
            <DisclaimerLink
              key={index}
              onClick={() => sdk.openPage(button.url)}
            >
              {button.title}
            </DisclaimerLink>
          ))}
        </div>
      )}
    </DisclaimerBlock>
  );
};

const useHideDisclaimerMutation = (title: string, kind: 'buy' | 'sell') => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, boolean>(async (hide) => {
    await storage.set<boolean>(`${kind}_${title}`, hide);
    await client.invalidateQueries([title, kind]);
  });
};

const useShowDisclaimer = (title: string, kind: 'buy' | 'sell') => {
  const storage = useStorage();
  return useQuery([title, kind], async () => {
    const hided = await storage.get<boolean>(`${kind}_${title}`);
    return hided === null ? false : hided;
  });
};

const replacePlaceholders = (
  url: string,
  config: TonendpointConfig,
  wallet: WalletState,
  fiat: FiatCurrencies
) => {
  return url
    .replace('{ADDRESS}', wallet.active.friendlyAddress)
    .replace('{CUR_FROM}', fiat)
    .replace('{CUR_TO}', 'TON')
    .replaceAll('{TX_ID}', config.mercuryoSecret ?? '');
};

export const BuyItemNotification: FC<{
  item: TonendpoinFiatItem;
  kind: 'buy' | 'sell';
}> = ({ item, kind }) => {
  const sdk = useAppSdk();
  const wallet = useWalletContext();
  const { config, fiat } = useAppContext();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data: hided } = useShowDisclaimer(item.title, kind);
  const { mutate } = useHideDisclaimerMutation(item.title, kind);

  const onForceOpen = () => {
    sdk.openPage(
      replacePlaceholders(item.action_button.url, config, wallet, fiat)
    );
    setOpen(false);
  };
  const onOpen = () => {
    if (hided) {
      onForceOpen();
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <ListItem key={item.title} onClick={onOpen}>
        <ListItemPayload>
          <Description>
            <Logo src={item.icon_url} />
            <Text>
              <Label1>{item.title}</Label1>
              <Body>{item.description}</Body>
            </Text>
          </Description>
          <Icon>
            <ChevronRightIcon />
          </Icon>
        </ListItemPayload>
      </ListItem>
      <Notification isOpen={open} handleClose={() => setOpen(false)}>
        {() => (
          <NotificationBlock>
            <Logo large src={item.icon_url} />
            <H2>{item.title}</H2>
            <Body>{item.description}</Body>
            <Disclaimer buttons={item.info_buttons} />
            <Button size="large" fullWith primary onClick={onForceOpen}>
              {item.action_button.title}
            </Button>
            <CheckboxBlock>
              <Checkbox checked={!!hided} onChange={mutate}>
                {t('Do_not_show_again')}
              </Checkbox>
            </CheckboxBlock>
          </NotificationBlock>
        )}
      </Notification>
    </>
  );
};
