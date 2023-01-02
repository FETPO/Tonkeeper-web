import React, { FC, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { Container } from '../styles/globalStyle';
import { CloseIcon } from './Icon';
import { Gap } from './Layout';
import ReactPortal from './ReactPortal';

const Wrapper = styled(Container)`
  width: 100%;
  overflow: auto;
  padding: 0;
`;

const ButtonContainer = styled.div`
  padding: 0 0 0 1rem;
  display: flex;
  justify-content: end;
`;

const CloseButton = styled.div`
  cursor: pointer;
  width: 28px;
  height: 28px;
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

const Splash = styled.div`
  position: fixed;
  inset: 0;
  top: 100vh;
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
  transform: scale(0.8);

  &.enter-done {
    top: 0;
    opacity: 1;
    pointer-events: auto;
    transform: scale(1);
  }

  &.exit {
    top: 100vh;
    opacity: 0;
    transform: scale(0.8);
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

export const Notification: FC<{
  isOpen: boolean;
  handleClose: () => void;
  children: (afterClose: (action: () => void) => void) => React.ReactNode;
}> = ({ children, isOpen, handleClose }) => {
  const nodeRef = useRef(null);
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === 'Escape' ? handleClose() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [handleClose]);

  const Child = children((afterClose: () => void) => {
    setTimeout(() => afterClose(), 300);
    handleClose();
  });

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <CSSTransition
        in={isOpen}
        timeout={{ enter: 0, exit: 300 }}
        unmountOnExit
        nodeRef={nodeRef}
      >
        <Splash ref={nodeRef}>
          <Wrapper>
            <Gap />
            <Content>
              <ButtonContainer>
                <CloseButton onClick={handleClose}>
                  <CloseIcon />
                </CloseButton>
              </ButtonContainer>
              {Child}
            </Content>
          </Wrapper>
        </Splash>
      </CSSTransition>
    </ReactPortal>
  );
};
