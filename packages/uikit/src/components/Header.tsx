import React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../hooks/translation';
import { H3 } from './Text';

const Block = styled.div`
  flex-shrink: 0;

  position: sticky;
  top: 0;
  padding: 1rem 0;

  display: flex;
  justify-content: center;
`;

export const Header = () => {
  const { t } = useTranslation();
  return (
    <Block>
      <H3>{t('Wallet')}</H3>
    </Block>
  );
};
