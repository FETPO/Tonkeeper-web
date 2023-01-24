import React, { FC } from 'react';
import styled from 'styled-components';
import { useOnImportAction } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { AppRoute, ImportRoute } from '../../libs/routes';
import { Button } from '../fields/Button';
import { TonkeeperIcon } from '../Icon';
import { Notification } from '../Notification';
import { Body1, H2 } from '../Text';

const BodyText = styled(Body1)`
  color: ${(props) => props.theme.textSecondary};
`;
const TextBlock = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const NotificationIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const ImportNotification: FC<{
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}> = ({ isOpen, setOpen }) => {
  const { t } = useTranslation();
  const onImport = useOnImportAction();

  return (
    <Notification isOpen={isOpen} handleClose={() => setOpen(false)}>
      {(onClose) => (
        <div>
          <NotificationIcon>
            <TonkeeperIcon />
          </NotificationIcon>
          <TextBlock>
            <H2>{t('Let_s_set_up_your_wallet')}</H2>
            <BodyText>{t('Let_s_set_up_your_wallet_description')}</BodyText>
          </TextBlock>
          <Button
            size="large"
            fullWith
            primary
            bottom
            onClick={() => {
              onClose(() => onImport(AppRoute.import + ImportRoute.create));
            }}
          >
            {t('Create_new_wallet')}
          </Button>
          <Button
            size="large"
            fullWith
            secondary
            bottom
            onClick={() => {
              onClose(() => onImport(AppRoute.import + ImportRoute.import));
            }}
          >
            {t('Import_existing_wallet')}
          </Button>
        </div>
      )}
    </Notification>
  );
};
