import { useQueryClient } from '@tanstack/react-query';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { AppRoute, SettingsRoute } from '../../libs/routes';
import { useMutateDeleteAll } from '../../state/account';
import { Button } from '../fields/Button';
import { Checkbox } from '../fields/Checkbox';
import { DisclaimerBlock } from '../home/BuyItemNotification';
import { Notification, NotificationBlock } from '../Notification';
import { Body1, H2, Label2 } from '../Text';

const BodyText = styled(Body1)`
  color: ${(props) => props.theme.textSecondary};
`;
const TextBlock = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const DisclaimerText = styled(Label2)`
  display: flex;
`;

const DisclaimerLink = styled(Label2)`
  cursor: pointer;
  color: ${(props) => props.theme.textAccent};
  margin-left: 2.1rem;
`;

const LotOutContent: FC<{ onClose: (action: () => void) => void }> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const { mutate, isLoading } = useMutateDeleteAll();

  return (
    <NotificationBlock>
      <TextBlock>
        <H2>{t('Log_out')}</H2>
        <BodyText>{t('Log_out_description')}</BodyText>
      </TextBlock>

      <DisclaimerBlock>
        <DisclaimerText>
          <Checkbox checked={checked} onChange={setChecked}>
            {t('I_have_a_backup_copy_of_recovery_phrase')}
          </Checkbox>
        </DisclaimerText>
        <DisclaimerLink
          onClick={() =>
            onClose(() => navigate(AppRoute.settings + SettingsRoute.recovery))
          }
        >
          {t('Back_up_now')}
        </DisclaimerLink>
      </DisclaimerBlock>
      <Button
        disabled={!checked}
        size="large"
        fullWith
        bottom
        loading={isLoading}
        onClick={() => {
          mutate();
          onClose(() => navigate(AppRoute.home));
        }}
      >
        {t('Log_out')}
      </Button>
    </NotificationBlock>
  );
};

export const LogOutNotification: FC<{
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}> = ({ isOpen, setOpen }) => {
  return (
    <Notification isOpen={isOpen} handleClose={() => setOpen(false)}>
      {(onClose) => <LotOutContent onClose={onClose} />}
    </Notification>
  );
};

const DeleteAllContent: FC<{ onClose: (action: () => void) => void }> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const { mutateAsync, isLoading } = useMutateDeleteAll();
  const client = useQueryClient();

  const onDelete = async () => {
    await mutateAsync();
    onClose(async () => {
      await client.invalidateQueries();
      navigate(AppRoute.home);
    });
  };

  return (
    <NotificationBlock>
      <TextBlock>
        <H2>{t('Delete_wallet_data')}</H2>
        <BodyText>{t('Delete_wallet_data_description')}</BodyText>
      </TextBlock>

      <DisclaimerBlock>
        <DisclaimerText>
          <Checkbox checked={checked} onChange={setChecked}>
            {t('I_have_a_backup_copy_of_recovery_phrase')}
          </Checkbox>
        </DisclaimerText>
        <DisclaimerLink
          onClick={() =>
            onClose(() => navigate(AppRoute.settings + SettingsRoute.recovery))
          }
        >
          {t('Back_up_now')}
        </DisclaimerLink>
      </DisclaimerBlock>
      <Button
        disabled={!checked}
        size="large"
        fullWith
        bottom
        loading={isLoading}
        onClick={onDelete}
      >
        {t('Log_out')}
      </Button>
    </NotificationBlock>
  );
};

export const DeleteAllNotification = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const notification = useMemo(() => {
    return searchParams.get('notification');
  }, [searchParams.get('notification')]);

  const handleClose = useCallback(() => {
    searchParams.delete('notification');
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const isOpen = notification === 'delete-all';

  const Content = useCallback(
    (afterClose: (action: () => void) => void) => {
      if (!isOpen) return undefined;
      return <DeleteAllContent onClose={afterClose} />;
    },
    [isOpen]
  );

  return (
    <Notification isOpen={isOpen} handleClose={handleClose}>
      {Content}
    </Notification>
  );
};
