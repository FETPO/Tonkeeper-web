import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { relative, SettingsRoute } from '../../libs/routes';
import { TonkeeperIcon } from '../Icon';
import { Body3, Label2 } from '../Text';

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
`;

const Logo = styled.span`
  font-size: 150%;
`;

export interface SettingsNetworkProps {
  version: string | undefined;
}

const Version = styled(Body3)`
  color: ${(props) => props.theme.textSecondary};
`;

export const SettingsNetwork: FC<SettingsNetworkProps> = ({ version }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onChange: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.detail === 6) {
        navigate(relative(SettingsRoute.dev));
      }
    },
    [navigate]
  );

  return (
    <Block onClick={onChange}>
      <Logo>
        <TonkeeperIcon />
      </Logo>
      <Label2>Tonkeeper</Label2>
      <Version>
        {t('Version')} {version}
      </Version>
    </Block>
  );
};
