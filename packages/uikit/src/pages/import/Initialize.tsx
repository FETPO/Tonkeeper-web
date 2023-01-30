import React, { FC, PropsWithChildren, useState } from 'react';
import styled, { css } from 'styled-components';
import { RocketIcon, ShieldIcon } from '../../components/create/CreateIcon';
import { Description } from '../../components/create/Description';
import { ImportNotification } from '../../components/create/ImportNotification';
import { Button } from '../../components/fields/Button';
import { H1 } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';

const Block = styled.div<{ fullHeight: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: var(--app-height);
  padding: 2rem 1rem;
  box-sizing: border-box;

  ${(props) =>
    props.fullHeight
      ? css`
          justify-content: space-between;
        `
      : css`
          justify-content: center;
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

const Title = styled(H1)`
  margin-bottom: 2rem;
  user-select: none;
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
        {/* <Description
          icon={<TicketIcon />}
          title={t('Built_in_subscriptions')}
          description={t('Built_in_subscriptions_description')}
        /> */}
      </div>
      <Button
        size="large"
        fullWith
        primary
        marginTop
        onClick={() => setOpen(true)}
      >
        {t('Get_started')}
      </Button>
      <ImportNotification isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};
