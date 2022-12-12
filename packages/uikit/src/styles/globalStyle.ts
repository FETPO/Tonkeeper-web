import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: ${(props) => props.theme.backgroundPage};
  color:  ${(props) => props.theme.textPrimary};
}
`;

export const Container = styled.div`
  min-width: 375px;
  max-width: 550px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 1rem;
`;

export const Body = styled.div`
  flex-grow: 1;
`;
