import React, { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Button } from '../../components/Button';
import {
  RocketIcon,
  ShieldIcon,
  TicketIcon,
} from '../../components/create/CreateIcon';
import { Description } from '../../components/create/Description';
import { Title } from '../../components/Text';
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

export const Initialize: FC = () => {
  return <WelcomePage />;
};

const Accent = styled.span`
  color: ${(props) => props.theme.accentBlue};
`;

export const WelcomePage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
        onClick={() => navigate(AppRoute.import + ImportRoute.create)}
      >
        {t('Get_started')}
      </Button>
    </>
  );
};
