import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';

const InputBlock = styled.div<{ focus: boolean; valid: boolean }>`
  width: 100%;
  line-height: 56px;
  border-radius: ${(props) => props.theme.cornerSmall};
  display: flex;
  padding: 0 1rem;
  gap: 0.5rem;
  box-sizing: border-box;
  position: relative;

  &:focus-within label {
    transform: translate(0, 6px) scale(0.7);
    color: ${(props) => props.theme.fieldActiveBorder};
  }

  ${(props) =>
    !props.valid
      ? css`
          border: 1px solid ${props.theme.fieldErrorBorder};
          background: ${props.theme.fieldErrorBackground};

          &:focus-within label {
            color: ${(props) => props.theme.fieldErrorBorder};
          }
        `
      : props.focus
      ? css`
          border: 1px solid ${props.theme.fieldActiveBorder};
          background: ${props.theme.fieldBackground};
        `
      : css`
          border: 1px solid ${props.theme.fieldBackground};
          background: ${props.theme.fieldBackground};
        `}
`;

const InputField = styled.input`
  outline: none;
  border: none;
  background: transparent;
  flex-grow: 1;
  font-weight: 500;
  font-size: 16px;
  padding-top: 10px;
  line-height: 46px;

  color: ${(props) => props.theme.textPrimary};
`;

const Label = styled.label<{ active?: boolean }>`
  position: absolute;
  pointer-events: none;
  transform: translate(0, 20px) scale(1);
  transform-origin: top left;
  transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  color: ${(props) => props.theme.textPrimary};
  font-size: 16px;
  line-height: 1;
  left: 1rem;

  ${(props) =>
    props.active &&
    css`
      transform: translate(0, 6px) scale(0.7);
    `}
`;

export const Input: FC<{
  type?: 'password' | undefined;
  value: string;
  onChange?: (value: string) => void;
  isValid?: boolean;
  label?: string;
  disabled?: boolean;
}> = ({ type, value, onChange, isValid = true, label, disabled }) => {
  const [focus, setFocus] = useState(false);

  return (
    <InputBlock focus={focus} valid={isValid}>
      <InputField
        disabled={disabled}
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      {label && <Label active={value != ''}>{label}</Label>}
    </InputBlock>
  );
};
