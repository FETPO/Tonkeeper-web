import {
  AccountRepr,
  JettonBalance,
  JettonsBalances,
} from '@tonkeeper/core/dist/tonApi';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../hooks/appContext';
import { useFormattedBalance, useFormattedPrice } from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { ToncoinIcon } from '../Icon';
import { ListBlock, ListItem, ListItemPayload } from '../List';
import { Body2, Label1 } from '../Text';

export interface AssetProps {
  info: AccountRepr | undefined;
  jettons: JettonsBalances | undefined;
}

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

const tonPrice: number = 2;

export const TonAsset: FC<{ info: AccountRepr | undefined }> = ({ info }) => {
  const { t } = useTranslation();
  const { fiat } = useAppContext();

  const balance = useFormattedBalance(fiat, 1231231231231); //info?.balance);
  const fiatAmount = useFormattedPrice(fiat, 1231231231231 * tonPrice);
  const price = useFormattedPrice(fiat, tonPrice, 0);

  return (
    <ListItem>
      <ListItemPayload>
        <Description>
          <ToncoinIcon />
          <Text>
            <Label1>{t('Toncoin')}</Label1>
            <Body>{price}</Body>
          </Text>
        </Description>
        <Text>
          <Label1>{balance}</Label1>
          <Body>{fiatAmount}</Body>
        </Text>
      </ListItemPayload>
    </ListItem>
  );
};

const Logo = styled.img`
  width: 60px;
  border-radius: ${(props) => props.theme.cornerFull};
`;

export const JettonAsset: FC<{ jetton: JettonBalance }> = ({ jetton }) => {
  const { fiat } = useAppContext();

  const balance = useFormattedBalance(
    fiat,
    jetton?.balance,
    jetton.metadata?.decimals
  );

  return (
    <ListItem>
      <ListItemPayload>
        <Description>
          <Logo src={jetton.metadata?.image} />
          <Label1>{jetton.metadata?.name}</Label1>
          <Body>{jetton.metadata?.symbol}</Body>
        </Description>
        <Text>
          <Label1>{balance}</Label1>
        </Text>
      </ListItemPayload>
    </ListItem>
  );
};

export const Assets: FC<AssetProps> = ({ info, jettons }) => {
  return (
    <ListBlock>
      <TonAsset info={info} />
      {(jettons?.balances ?? []).map((jetton) => (
        <JettonAsset key={jetton.jettonAddress} jetton={jetton} />
      ))}
    </ListBlock>
  );
};
