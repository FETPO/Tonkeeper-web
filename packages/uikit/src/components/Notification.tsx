import React, { FC, useEffect, useMemo, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { Container } from '../styles/globalStyle';
import { CloseIcon } from './Icon';
import { Gap } from './Layout';
import ReactPortal from './ReactPortal';
import { H2 } from './Text';

const Wrapper = styled(Container)`
  width: 100%;
  padding: 0;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;

const Padding = styled.div`
  flex-shrink: 0;
  height: 2rem;
`;

const CloseButton = styled.div`
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  border-radius: ${(props) => props.theme.cornerFull};
  color: ${(props) => props.theme.textPrimary};
  background: ${(props) => props.theme.backgroundContent};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }
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
  min-height: 40vh;
  box-sizing: border-box;
`;

export const NotificationTitle = styled(H2)`
  padding-right: 2rem;
  box-sizing: border-box;
`;

export const NotificationBlock = styled.form`
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  align-items: center;
`;

export const NotificationIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const NotificationCancelButton: FC<{ handleClose: () => void }> = ({
  handleClose,
}) => {
  return (
    <ButtonContainer>
      <CloseButton onClick={handleClose}>
        <CloseIcon />
      </CloseButton>
    </ButtonContainer>
  );
};

export const Notification: FC<{
  isOpen: boolean;
  handleClose?: () => void;
  children: (afterClose: (action?: () => void) => void) => React.ReactNode;
}> = React.memo(({ children, isOpen, handleClose }) => {
  const nodeRef = useRef(null);
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === 'Escape' ? handleClose && handleClose() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [handleClose]);

  const Child = useMemo(() => {
    if (!isOpen) return undefined;
    return children((afterClose?: () => void) => {
      setTimeout(() => afterClose && afterClose(), 300);
      handleClose && handleClose();
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
            <Wrapper>
              <Padding />
              <Gap />
              <Content>
                {handleClose && (
                  <NotificationCancelButton handleClose={handleClose} />
                )}
                {Child}
              </Content>
            </Wrapper>
          </Overlay>
        </Splash>
      </CSSTransition>
    </ReactPortal>
  );
});
