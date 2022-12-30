import React, { FC, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { CheckboxIcon } from './Icon';
import { Label2 } from './Text';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Wrapper = styled.div`
  display: inline-flex;
  gap: 0.5rem;
  gap: 0.75rem;
  align-items: center;

  cursor: pointer;
`;

const Icon = styled.div<{ checked: boolean; disabled?: boolean }>`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-width: 2px;
  border-style: solid;
  box-sizing: border-box;
  border-radius: ${(props) => props.theme.cornerExtraExtraSmall};

  ${(props) =>
    props.disabled
      ? css`
          opacity: 0.48;
        `
      : undefined}

  ${(props) =>
    props.checked
      ? css`
          background: ${props.theme.buttonPrimaryBackground};
          border-color: ${props.theme.buttonPrimaryBackground};
        `
      : css`
          background: transparent;
          border-color: ${props.theme.backgroundContentTint};
        `}
`;

const Text = styled(Label2)`
  color: ${(props) => props.theme.textSecondary};
`;

export const Checkbox: FC<PropsWithChildren<CheckboxProps>> = ({
  checked,
  onChange,
  disabled,
  children,
}) => {
  return (
    <Wrapper onClick={() => onChange(!checked)}>
      <Icon checked={checked} disabled={disabled}>
        {checked ? <CheckboxIcon /> : undefined}
      </Icon>
      <Text>{children}</Text>
    </Wrapper>
  );
};
