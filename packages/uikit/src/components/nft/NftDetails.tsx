import { NftItemRepr } from '@tonkeeper/core/dist/tonApi';
import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Address } from 'ton';
import { useAppSdk } from '../../hooks/appSdk';
import { useTranslation } from '../../hooks/translation';
import { ListBlock, ListItem, ListItemPayload } from '../List';
import { H3, Label1, Label2 } from '../Text';

const Block = styled.div`
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Link = styled(Label1)`
  cursor: pointer;
  color: ${(props) => props.theme.textAccent};
`;

const RightText = styled(Label2)`
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
        <ListBlock>
          {owner && (
            <ListItem hover={false}>
              <ListItemPayload>
                <RightText>{t('Owner')}</RightText>
                <Label2>
                  {toShortAddress(Address.parse(owner).toString())}
                </Label2>
              </ListItemPayload>
            </ListItem>
          )}
          <ListItem hover={false}>
            <ListItemPayload>
              <RightText>{t('Contract_address')}</RightText>
              <Label2>{toShortAddress(address)}</Label2>
            </ListItemPayload>
          </ListItem>
        </ListBlock>
      </Block>
    );
  }
);
