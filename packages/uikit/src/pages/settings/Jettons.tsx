import { JettonBalance } from '@tonkeeper/core/dist/tonApi';
import React, { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ColumnText } from '../../components/Layout';

import { ListBlock, ListItem, ListItemPayload } from '../../components/List';
import { SubHeader } from '../../components/SubHeader';
import { Switch } from '../../components/Switch';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useCoinBalance } from '../../hooks/balance';
import { useTranslation } from '../../hooks/translation';
import { useJettonsInfo, useToggleJettonMutation } from '../../state/jetton';

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const Logo = styled.img`
  width: 44px;
  border-radius: ${(props) => props.theme.cornerFull};
`;

const JettonRow: FC<{ jetton: JettonBalance }> = ({ jetton }) => {
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
    <ListItem hover={false}>
      <ListItemPayload>
        <Row>
          <Logo src={jetton.metadata?.image} />
          <ColumnText
            text={jetton.metadata?.name ?? t('Unknown_COIN')}
            secondary={`${balance} ${jetton.metadata?.symbol}`}
          />
        </Row>
        <Switch checked={checked} onChange={onChange} />
      </ListItemPayload>
    </ListItem>
  );
};

export const JettonsSettings = () => {
  const { t } = useTranslation();
  const { data } = useJettonsInfo();
  return (
    <>
      <SubHeader title={t('List_of_tokens')} />
      <ListBlock>
        {(data?.balances ?? []).map((jetton) => (
          <JettonRow key={jetton.jettonAddress} jetton={jetton} />
        ))}
      </ListBlock>
    </>
  );
};
