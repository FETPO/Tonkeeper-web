import { switchNetwork } from '@tonkeeper/core/dist/entries/network';
import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { useMutateNetwork, useNetwork } from '../../state/network';
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
  const { data: network } = useNetwork();
  const { mutate } = useMutateNetwork();

  const onChange = useCallback(() => {
    if (!network) return;
    mutate(switchNetwork(network));
  }, [network]);

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
