import React, { FC } from 'react';
import styled from 'styled-components';
import { useOnImportAction } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { AppRoute, ImportRoute } from '../../libs/routes';
import { Button } from '../Button';
import { TonkeeperIcon } from '../Icon';
import { Notification } from '../Notification';
import { Body1, H2 } from '../Text';

const IconBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 300%;
`;

const BodyText = styled(Body1)`
  color: ${(props) => props.theme.textSecondary};
`;
const TextBlock = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const ImportNotification: FC<{
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}> = ({ isOpen, setOpen }) => {
  const { t } = useTranslation();
  const onImport = useOnImportAction();

  return (
    <Notification isOpen={isOpen} handleClose={() => setOpen(false)}>
      <div>
        <IconBlock>
          <TonkeeperIcon />
        </IconBlock>
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
            setOpen(false);
            setTimeout(
              () => onImport(AppRoute.import + ImportRoute.create),
              300
            );
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
            setOpen(false);
            setTimeout(
              () => onImport(AppRoute.import + ImportRoute.import),
              300
            );
          }}
        >
          {t('Import_existing_wallet')}
        </Button>
      </div>
    </Notification>
  );
};
