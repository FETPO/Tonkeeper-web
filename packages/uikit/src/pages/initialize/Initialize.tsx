import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/Button';
import {
  RocketIcon,
  ShieldIcon,
  TicketIcon,
} from '../../components/create/CreateIcon';
import { Description } from '../../components/create/Description';
import { Title } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';

export const Initialize: FC = () => {
  return <WelcomePage />;
};

const Accent = styled.span`
  color: ${(props) => props.theme.accentBlue};
`;

const Block = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const WelcomePage = () => {
  const { t } = useTranslation();
  return (
    <Block>
      <Title>
        {t('Welcome_to')} <Accent>Tonkeeper</Accent>
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
      <Button size="large" fullWith primary>
        {t('Get_started')}
      </Button>
    </Block>
  );
};
