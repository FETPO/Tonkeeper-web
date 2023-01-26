import React, { FC, useEffect, useMemo, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { Container } from '../styles/globalStyle';
import { BackButton } from './fields/BackButton';
import { CloseIcon } from './Icon';
import { Gap } from './Layout';
import ReactPortal from './ReactPortal';
import { H2 } from './Text';

const NotificationContainer = styled(Container)`
  background: transparent;
`;
const Wrapper = styled.div`
  display: flex;
  display: flex;
  flex-direction: column;
  min-height: var(--app-height);
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;

const Padding = styled.div`
  flex-shrink: 0;
  height: 2rem;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  top: var(--app-height);
  transition: all 0.3s ease-in-out;
`;
const Splash = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  z-index: 10;
  padding: 0;
  opacity: 0;
  pointer-events: none;

  &.enter-done {
    opacity: 1;
    pointer-events: auto;
    overflow: auto;
  }
  &.enter-done ${Overlay} {
    top: 0;
    pointer-events: auto;
    overflow: auto;
  }

  &.exit {
    opacity: 0;
  }
  &.exit ${Overlay} {
    top: var(--app-height);
  }
`;

const Content = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.backgroundPage};
  border-top-right-radius: ${(props) => props.theme.cornerLarge};
  border-top-left-radius: ${(props) => props.theme.cornerLarge};
  padding: 1rem;
  flex-shrink: 0;
  box-sizing: border-box;
`;

export const NotificationTitle = styled(H2)`
  padding-right: 2rem;
  box-sizing: border-box;
`;

export const NotificationBlock = styled.form`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
`;

export const NotificationCancelButton: FC<{ handleClose: () => void }> = ({
  handleClose,
}) => {
  return (
    <BackButton onClick={handleClose}>
      <CloseIcon />
    </BackButton>
  );
};

export const Notification: FC<{
  isOpen: boolean;
  handleClose: () => void;
  hideButton?: boolean;
  children: (afterClose: (action?: () => void) => void) => React.ReactNode;
}> = React.memo(({ children, isOpen, hideButton, handleClose }) => {
  const nodeRef = useRef(null);
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === 'Escape' ? handleClose() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [handleClose]);

  const Child = useMemo(() => {
    if (!isOpen) return undefined;
    return children((afterClose?: () => void) => {
      setTimeout(() => afterClose && afterClose(), 300);
      handleClose();
    });
  }, [isOpen, children, handleClose]);

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <CSSTransition
        in={isOpen}
        timeout={{ enter: 0, exit: 300 }}
        unmountOnExit
        nodeRef={nodeRef}
      >
        <Splash ref={nodeRef}>
          <Overlay>
            <NotificationContainer>
              <Wrapper>
                <Padding onClick={handleClose} />
                <Gap onClick={handleClose} />
                <Content>
                  {!hideButton && (
                    <ButtonContainer>
                      <NotificationCancelButton handleClose={handleClose} />
                    </ButtonContainer>
                  )}
                  {Child}
                </Content>
              </Wrapper>
            </NotificationContainer>
          </Overlay>
        </Splash>
      </CSSTransition>
    </ReactPortal>
  );
});
