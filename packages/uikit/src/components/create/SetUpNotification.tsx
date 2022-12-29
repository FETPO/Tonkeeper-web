import { popUpInternalEventEmitter } from '@tonkeeper/core/dist/popUpEvents';
import { delay } from '@tonkeeper/core/dist/utils/common';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

const Splash = styled.div<{ active: boolean }>`
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  ${(props) =>
    props.active &&
    css`
      opacity: 0.5;
    `}
`;

const Block = styled.div<{ active: boolean }>`
  z-index: 20;
  position: fixed;
  left: 0;
  right: 0;
  height: 90vh;
  bottom: -90vh;
  transition: bottom 0.3s ease-in-out;

  ${(props) =>
    props.active &&
    css`
      bottom: 0;
    `}
`;

const Grid = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const SetUpNotification = () => {
  const [messageId, setMessageId] = useState<number | undefined>();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (messageId) {
      delay(20).then(() => setActive(true));
    }
  }, [messageId]);

  useEffect(() => {
    const handler = ({ id }: { id?: number | undefined }) => {
      setMessageId((prevId) => {
        if (prevId != null) {
          popUpInternalEventEmitter.emit('response', {
            method: 'response',
            id,
            params: new Error('Set Up already in progress'),
          });
          return prevId;
        } else {
          return id;
        }
      });
    };
    popUpInternalEventEmitter.on('setUpNotification', handler);

    return () => {
      popUpInternalEventEmitter.off('setUpNotification', handler);
    };
  }, []);

  return (
    <>
      {messageId && <Splash active={active} />}
      <Block active={active}>
        <Grid>Text</Grid>
      </Block>
    </>
  );
};
