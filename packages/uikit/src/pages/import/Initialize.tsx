import React, { FC, PropsWithChildren, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../../components/Button';
import {
  RocketIcon,
  ShieldIcon,
  TicketIcon,
} from '../../components/create/CreateIcon';
import { Description } from '../../components/create/Description';
import { ImportNotification } from '../../components/create/ImportNotification';
import { Title } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';

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

export const Initialize: FC = () => {
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
      <ImportNotification isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};
