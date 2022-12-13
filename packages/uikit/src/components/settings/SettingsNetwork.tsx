import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/translation';
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
  onChangeNetwork: () => void;
  version: string | undefined;
}

const Version = styled(Body3)`
  color: ${(props) => props.theme.textSecondary};
`;

export const SettingsNetwork: FC<SettingsNetworkProps> = ({
  onChangeNetwork,
  version,
}) => {
  const { t } = useTranslation();
  return (
    <Block>
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
