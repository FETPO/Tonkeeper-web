import React, { FC, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { useAppSdk } from '../hooks/appSdk';
import { useTranslation } from '../hooks/translation';
import ReactPortal from './ReactPortal';
import { Label2 } from './Text';

const Message = styled.div`
  position: fixed;
  z-index: 20;
  top: -30px;
  left: 50%;

  width: 140px;
  margin-left: -70px;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;

  background: ${(props) => props.theme.backgroundContent};
  border-radius: ${(props) => props.theme.cornerLarge};

  transition: all 0.1s ease-in-out;

  &.enter-done {
    top: 30px;
    opacity: 1;
    pointer-events: auto;
    transform: scale(1);
    overflow: auto;
  }

  &.exit {
    top: -30px;
    opacity: 0;
    transform: scale(0.8);
  }
`;

export const CopyNotification: FC = React.memo(() => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const sdk = useAppSdk();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const handler = () => {
      if (timer) {
        clearTimeout(timer);
      }
      setOpen(true);
      timer = setTimeout(() => {
        setOpen(false);
      }, 2000);
    };
    sdk.uiEvents.on('copy', handler);
    return () => {
      sdk.uiEvents.off('copy', handler);
    };
  }, []);

  const nodeRef = useRef(null);

  return (
    <ReactPortal wrapperId="react-copy-modal">
      <CSSTransition
        in={isOpen}
        timeout={{ enter: 0, exit: 300 }}
        unmountOnExit
        nodeRef={nodeRef}
      >
        <Message ref={nodeRef}>
          <Label2>{t('Copied')}</Label2>
        </Message>
      </CSSTransition>
    </ReactPortal>
  );
});
