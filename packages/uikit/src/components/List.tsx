import styled, { css } from 'styled-components';

export const ListBlock = styled.div<{ margin?: boolean; dropDown?: boolean }>`
  display: flex;
  flex-direction: column;

  ${(props) =>
    props.dropDown
      ? css`
          background: ${(props) => props.theme.backgroundContentTint};
        `
      : css`
          background: ${(props) => props.theme.backgroundContent};
        `}

  padding: 0;

  ${(props) =>
    props.margin !== false
      ? css`
          margin: 0 0 2rem;
        `
      : undefined}

  border-radius: ${(props) => props.theme.cornerMedium};

  > div:first-child {
    border-top-right-radius: ${(props) => props.theme.cornerMedium};
    border-top-left-radius: ${(props) => props.theme.cornerMedium};
  }
  > div:last-child {
    border-bottom-right-radius: ${(props) => props.theme.cornerMedium};
    border-bottom-left-radius: ${(props) => props.theme.cornerMedium};
  }
`;

export const ListItemPayload = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 1rem 0;
  box-sizing: border-box;
`;

export const ListItem = styled.div<{ hover?: boolean; dropDown?: boolean }>`
  display: flex;
  padding: 0 0 0 1rem;

  ${(props) =>
    props.dropDown
      ? css`
          background: ${(props) => props.theme.backgroundContentTint};
        `
      : css`
          background: ${(props) => props.theme.backgroundContent};
        `}

  ${(props) =>
    props.hover !== false
      ? css`
          cursor: pointer;
          &:hover {
            background: ${props.theme.backgroundContentTint};

            > div {
              border-top-color: ${props.theme.backgroundContentTint} !important;
            }
          }
        `
      : undefined}

  & + & > div {
    border-top: 1px solid ${(props) => props.theme.separatorCommon};
    padding-top: 15px;
  }
`;
