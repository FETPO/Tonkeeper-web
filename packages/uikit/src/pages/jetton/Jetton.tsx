import React, { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Action, ActionsRow } from '../../components/home/Actions';
import { SendIcon } from '../../components/home/HomeIcons';
import { useFormatCoinValue } from '../../components/home/Jettons';
import { ReceiveAction } from '../../components/home/ReceiveAction';
import { Loading } from '../../components/Loading';
import { SubHeader } from '../../components/SubHeader';
import { Body2, H2 } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';
import { AppRoute } from '../../libs/routes';
import { useJettonInfo, useJettonsBalances } from '../../state/jetton';

const Block = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0 3rem;
  width: 100%;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
`;

const Image = styled.img`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 100%;
`;

const JettonContent: FC<{ jettonAddress: string }> = ({ jettonAddress }) => {
  const { t } = useTranslation();

  const { data: info } = useJettonInfo(jettonAddress);
  const { data: balances } = useJettonsBalances();

  const format = useFormatCoinValue();

  const balance = balances?.balances.find(
    (item) => item.jettonAddress === jettonAddress
  );

  if (!info) {
    return <Loading />;
  }

  const amount = balance?.balance
    ? format(balance?.balance, info.metadata.decimals)
    : '-';

  console.log(info);

  const { description, image, name } = info.metadata;

  return (
    <div>
      <SubHeader title={name} />
      <Block>
        <Text>
          <H2>
            {amount} {info.metadata.symbol}
          </H2>
          {description && <Body2>{description}</Body2>}
        </Text>
        <Image src={image} />
      </Block>
      <ActionsRow>
        <Action icon={<SendIcon />} title={t('Send')} action={() => null} />
        <ReceiveAction />
      </ActionsRow>
    </div>
  );
};

export const Jetton = () => {
  const navigate = useNavigate();
  const { jettonAddress } = useParams();

  if (!jettonAddress) return null;

  useEffect(() => {
    if (!jettonAddress) {
      navigate(AppRoute.home);
    }
  }, [jettonAddress]);

  return <JettonContent jettonAddress={decodeURIComponent(jettonAddress)} />;
};
