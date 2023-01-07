import { useQuery } from '@tanstack/react-query';
import { AuthState } from '@tonkeeper/core/dist/entries/password';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { decrypt } from '@tonkeeper/core/dist/service/cryptoService';
import React, { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { mnemonicValidate } from 'ton-crypto';
import { ChevronLeftIcon } from '../../components/Icon';
import { Loading } from '../../components/Loading';
import { Body1, Body2, H2 } from '../../components/Text';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';
import { AppRoute } from '../../libs/routes';

export const ActiveRecovery = () => {
  const wallet = useWalletContext();
  return <RecoveryContent tonkeeperId={wallet.tonkeeperId} />;
};

export const Recovery = () => {
  const { tonkeeperId } = useParams();
  if (tonkeeperId) {
    return <RecoveryContent tonkeeperId={tonkeeperId} />;
  } else {
    return <ActiveRecovery />;
  }
};

const getPassword = async (auth: AuthState): Promise<string> => {
  return 'moke';
};

const useMnemonic = (tonkeeperId: string, auth: AuthState) => {
  const { account } = useAppContext();
  return useQuery([tonkeeperId, AppKey.account], async () => {
    const wallet = account.wallets.find(
      (item) => item.tonkeeperId === tonkeeperId
    );
    if (!wallet) {
      throw new Error('Missing wallet');
    }

    const password = auth.kind === 'none' ? auth.kind : await getPassword(auth);
    const mnemonic = (await decrypt(wallet.mnemonic, password)).split(' ');
    const isValid = await mnemonicValidate(mnemonic);
    if (!isValid) {
      throw new Error('Wallet mnemonic  not valid');
    }

    return mnemonic;
  });
};

const BackButton = styled.div`
  cursor: pointer;
  position: absolute;
  left: 0;
  bottom: 100%;
  width: 28px;
  height: 28px;
  border-radius: ${(props) => props.theme.cornerFull};
  color: ${(props) => props.theme.textPrimary};
  background: ${(props) => props.theme.backgroundContent};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }
`;

const Wrapper = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;

  flex-direction: column;

  height: calc(100vh - 81px);
`;

const Block = styled.div`
  display: flex;
  text-align: center;
  gap: 1rem;
  flex-direction: column;

  position: relative;
`;

const Body = styled(Body2)`
  text-align: center;
  color: ${(props) => props.theme.textSecondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(12, minmax(0, 1fr));
  grid-auto-flow: column;
  gap: 0.5rem;
  place-content: space-around;
`;

const World = styled(Body1)``;

const Number = styled.span`
  display: inline-block;
  width: 30px;
  color: ${(props) => props.theme.textSecondary};
`;

const RecoveryContent: FC<{ tonkeeperId: string }> = ({ tonkeeperId }) => {
  const { auth } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: mnemonic } = useMnemonic(tonkeeperId, auth);

  const onBack = () => {
    navigate(AppRoute.settings);
  };

  if (!mnemonic) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <Block>
        <BackButton onClick={onBack}>
          <ChevronLeftIcon />
        </BackButton>
        <H2>{t('Your_recovery_phrase')}</H2>
        <Body>{t('Your_recovery_phrase_description')}</Body>
      </Block>

      <Grid>
        {mnemonic.map((world, index) => (
          <World key={index}>
            <Number> {index + 1}.</Number> {world}{' '}
          </World>
        ))}
      </Grid>
    </Wrapper>
  );
};
