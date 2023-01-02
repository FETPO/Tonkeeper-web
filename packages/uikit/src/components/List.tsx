import styled, { css } from 'styled-components';

export const ListBlock = styled.div<{ margin?: boolean }>`
  display: flex;
  flex-direction: column;

  background: ${(props) => props.theme.backgroundContent};
  padding: 0;

  ${(props) =>
    props.margin !== false
      ? css`
          margin: 1rem 0 2rem;
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
`;
export const ListItem = styled.div<{ hover?: boolean }>`
  display: flex;
  padding: 0 0 0 1rem;
  cursor: pointer;

  ${(props) =>
    props.hover !== false
      ? css`
          &:hover {
            background: ${props.theme.backgroundContentTint};
          }
        `
      : undefined}

  & + & ${ListItemPayload} {
    border-top: 1px solid ${(props) => props.theme.separatorCommon};
  }
`;
