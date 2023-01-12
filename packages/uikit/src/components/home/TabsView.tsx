import {
  AccountRepr,
  JettonsBalances,
  NftItemsRepr,
} from '@tonkeeper/core/dist/tonApi';
import { TonendpointStock } from '@tonkeeper/core/dist/tonkeeperApi/stock';
import React, { FC, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { NftsList } from '../nft/Nfts';
import { Label1 } from '../Text';
import { JettonList } from './Jettons';

const TabsBlock = styled.div`
  display: flex;
  margin-bottom: 2rem;
  position: relative;
  justify-content: center;
  gap: 3rem;
`;

const TabsButton = styled.div<{ active?: boolean }>`
  cursor: pointer;

  ${(props) =>
    props.active
      ? css`
          color: ${props.theme.textPrimary};
        `
      : css`
          color: ${props.theme.textSecondary};
        `}
`;

const Line = styled.span`
  position: absolute;
`;

enum HomeTabs {
  Tokens = 0,
  Collectibles = 1,
}

const Tabs: FC<{ tab: HomeTabs; onTab: (value: HomeTabs) => void }> = ({
  tab,
  onTab,
}) => {
  const { t } = useTranslation();
  const blockRef = useRef(null);
  const lineRef = useRef(null);

  return (
    <TabsBlock ref={blockRef}>
      <TabsButton
        active={tab === HomeTabs.Tokens}
        onClick={() => onTab(HomeTabs.Tokens)}
      >
        <Label1>{t('Tokens')}</Label1>
      </TabsButton>
      <TabsButton
        active={tab === HomeTabs.Collectibles}
        onClick={() => onTab(HomeTabs.Collectibles)}
      >
        <Label1>{t('Collectibles')}</Label1>
      </TabsButton>
      <Line ref={lineRef} />
    </TabsBlock>
  );
};
export const TabsView: FC<{
  stock: TonendpointStock;
  jettons: JettonsBalances;
  info: AccountRepr;
  nfts: NftItemsRepr;
}> = ({ stock, jettons, info, nfts }) => {
  const [tab, setTab] = useState<HomeTabs>(HomeTabs.Tokens);

  return (
    <>
      <Tabs tab={tab} onTab={setTab} />
      {tab === HomeTabs.Tokens && (
        <JettonList info={info} jettons={jettons} stock={stock} />
      )}
      {tab === HomeTabs.Collectibles && <NftsList nfts={nfts} />}
    </>
  );
};
