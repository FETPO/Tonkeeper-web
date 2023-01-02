import styled, { css } from 'styled-components';

export const ListBlock = styled.div`
  display: flex;
  flex-direction: column;

  background: ${(props) => props.theme.backgroundContent};
  padding: 0;
  margin: 1rem 0 2rem;

  border-radius: ${(props) => props.theme.cornerMedium};
  overflow: hidden;
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

  + * ${ListItemPayload} {
    border-top: 1px solid ${(props) => props.theme.separatorCommon};
  }
`;
