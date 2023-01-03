import {
  AccountRepr,
  JettonsBalances,
  NftItemsRepr,
} from '@tonkeeper/core/dist/tonApi';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { AppRoute, SettingsRoute } from '../../libs/routes';
import { Label2 } from '../Text';
import { Assets } from './Jettons';
import { NftsList } from './Nfts';

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
`;

const EditButton = styled(Label2)`
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: ${(props) => props.theme.cornerMedium};
  color: ${(props) => props.theme.textPrimary};
  background: ${(props) => props.theme.backgroundContent};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }
`;

export const CompactView: FC<{
  jettons: JettonsBalances | undefined;
  info: AccountRepr | undefined;
  nfts: NftItemsRepr | undefined;
}> = ({ jettons, info, nfts }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Assets info={info} jettons={jettons} />
      <ButtonRow>
        <EditButton
          onClick={() => navigate(AppRoute.settings + SettingsRoute.jettons)}
        >
          {t('Edit')}
        </EditButton>
      </ButtonRow>
      <NftsList nfts={nfts} />
    </>
  );
};
