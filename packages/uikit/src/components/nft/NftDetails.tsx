import { NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Address } from 'ton';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { ListBlock, ListItem, ListItemPayload } from '../List';
import { Body1, H3, Label1 } from '../Text';

const Block = styled.div`
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
`;

const Link = styled(Label1)`
  cursor: pointer;
  color: ${(props) => props.theme.textAccent};
`;

const RightText = styled(Body1)`
  color: ${(props) => props.theme.textSecondary};
`;

export const NftDetails: FC<{ nftItem: NftItemRepr }> = React.memo(
  ({ nftItem }) => {
    const { t } = useTranslation();
    const sdk = useAppSdk();
    const owner = nftItem.owner?.address;
    const address = Address.parse(nftItem.address).toString();

    return (
      <Block>
        <Row>
          <H3>{t('Details')}</H3>
          <Link
            onClick={() => sdk.openPage(`https://tonapi.io/account/${address}`)}
          >
            {t('View_in_explorer')}
          </Link>
        </Row>
        <ListBlock margin={false}>
          {owner && (
            <ListItem
              onClick={() =>
                sdk.copyToClipboard(Address.parse(owner).toString())
              }
            >
              <ListItemPayload>
                <RightText>{t('Owner')}</RightText>
                <Label1>
                  {toShortAddress(Address.parse(owner).toString())}
                </Label1>
              </ListItemPayload>
            </ListItem>
          )}
          <ListItem onClick={() => sdk.copyToClipboard(address)}>
            <ListItemPayload>
              <RightText>{t('Contract_address')}</RightText>
              <Label1>{toShortAddress(address)}</Label1>
            </ListItemPayload>
          </ListItem>
        </ListBlock>
      </Block>
    );
  }
);
