import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { relative, SettingsRoute } from '../../libs/routes';
import { TonkeeperIcon } from '../Icon';
import { Body3, Label2 } from '../Text';

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0 1.563rem;
`;

export interface SettingsNetworkProps {
  version: string | undefined;
}

const Version = styled(Body3)`
  margin-top: 0.125rem;
  color: ${(props) => props.theme.textSecondary};
`;

const Icon = styled.span`
  margin-bottom: 0.25rem;
`;

export const SettingsNetwork: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { version } = useAppSdk();

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
      <Icon>
        <TonkeeperIcon width="33" height="33" />
      </Icon>
      <Label2>Tonkeeper Beta</Label2>
      <Version>
        {t('Version')} {version}
      </Version>
    </Block>
  );
};
