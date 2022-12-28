import React, { FC, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  fullWith?: boolean;
  bottom?: boolean;
}

const ButtonElement = styled.button<ButtonProps>`
  border: 0;
  outline: 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;

  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;

  cursor: pointer;

  flex-shrink: 0;

  ${(props) =>
    props.bottom
      ? css`
          margin-bottom: 1rem;
        `
      : undefined}

  ${(props) =>
    props.fullWith
      ? css`
          width: 100%;
        `
      : css`
          width: auth;
        `}

  ${(props) => {
    switch (props.size) {
      case 'large':
        return css`
          height: 56px;
          padding: 0px 24px;
        `;
      case 'small':
        return css`
          height: 36px;
          padding: 0px 16px;
        `;
      default:
        return css`
          height: 48px;
          padding: 0px 20px;
        `;
    }
  }}

  ${(props) => {
    switch (props.size) {
      case 'small':
        return css`
          font-size: 14px;
          line-height: 20px;
        `;
      default:
        return css`
          font-size: 16px;
          line-height: 24px;
        `;
    }
  }}

  ${(props) => {
    switch (props.size) {
      case 'large':
        return css`
          border-radius: ${props.theme.cornerSmall};
        `;
      default:
        return css`
          border-radius: ${props.theme.cornerLarge};
        `;
    }
  }}
  
  ${(props) => {
    if (props.primary) {
      return css`
        color: ${props.theme.buttonPrimaryForeground};
      `;
    } else if (props.secondary) {
      return css`
        color: ${props.theme.buttonSecondaryForeground};
      `;
    } else {
      return css`
        color: ${props.theme.buttonTertiaryForeground};
      `;
    }
  }}
  ${(props) => {
    if (props.primary) {
      if (props.disabled) {
        return css`
          background: ${props.theme.buttonPrimaryBackgroundDisabled};
        `;
      } else {
        return css`
          background: ${props.theme.buttonPrimaryBackground};
        `;
      }
    } else if (props.secondary) {
      if (props.disabled) {
        return css`
          background: ${props.theme.buttonSecondaryBackgroundDisabled};
        `;
      } else {
        return css`
          background: ${props.theme.buttonSecondaryBackground};
        `;
      }
    } else {
      if (props.disabled) {
        return css`
          background: ${props.theme.buttonTertiaryBackgroundDisabled};
        `;
      } else {
        return css`
          background: ${props.theme.buttonTertiaryBackground};
        `;
      }
    }
  }}
`;

export const Button: FC<
  PropsWithChildren<
    ButtonProps &
      Omit<
        React.HTMLProps<HTMLButtonElement>,
        'size' | 'children' | 'ref' | 'type' | 'as'
      >
  >
> = ({ children, ...props }) => {
  return <ButtonElement {...props}>{children}</ButtonElement>;
};
