import React, { FC, PropsWithChildren, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../../components/Button';
import {
  RocketIcon,
  ShieldIcon,
  TicketIcon,
} from '../../components/create/CreateIcon';
import { Description } from '../../components/create/Description';
import { TonkeeperIcon } from '../../components/Icon';
import { Notification } from '../../components/Notification';
import { Body1, H2, Title } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';
import { AppRoute, ImportRoute } from '../../libs/routes';

const Block = styled.div<{ fullHeight: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100vh;

  ${(props) =>
    props.fullHeight
      ? css`
          justify-content: space-between;
        `
      : css`
          justify-content: center;
          gap: 3rem;
        `}
`;

export const InitializeContainer: FC<
  PropsWithChildren<{ fullHeight?: boolean }>
> = ({ fullHeight = true, children }) => {
  return <Block fullHeight={fullHeight}>{children}</Block>;
};

const Accent = styled.span`
  color: ${(props) => props.theme.accentBlue};
`;

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

export const Initialize: FC<{ onImport: (path: string) => void }> = ({
  onImport,
}) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Title>
        {t('Welcome_to')}&nbsp;<Accent>Tonkeeper</Accent>
      </Title>
      <div>
        <Description
          icon={<RocketIcon />}
          title={t('World_class_speed')}
          description={t('World_class_speed_description')}
        />
        <Description
          icon={<ShieldIcon />}
          title={t('End_to_end_security')}
          description={t('End_to_end_security_description')}
        />
        <Description
          icon={<TicketIcon />}
          title={t('Built_in_subscriptions')}
          description={t('Built_in_subscriptions_description')}
        />
      </div>
      <Button
        size="large"
        fullWith
        primary
        bottom
        onClick={() => setOpen(true)}
      >
        {t('Get_started')}
      </Button>
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
    </>
  );
};
