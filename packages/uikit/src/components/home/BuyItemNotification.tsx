import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAppSdk } from '../../hooks/appSdk';
import { useStorage } from '../../hooks/storage';
import { useTranslation } from '../../hooks/translation';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { ChevronRightIcon } from '../Icon';
import { Notification } from '../Notification';
import { ItemPayload, SettingsListItem } from '../settings/SettingsList';
import { Body2, H2, Label1, Label2 } from '../Text';

export interface BuyItem {
  logo: string;
  title: string;
  description: string;
  isBot?: boolean;
  termsOfUse?: string;
  privacyPolicy?: string;
  link: string;
}

const Logo = styled.img<{ large?: boolean }>`
  ${(props) =>
    props.large
      ? css`
          width: 60px;
        `
      : css`
          width: 40px;
        `}

  border-radius: ${(props) => props.theme.cornerFull};
`;

const Description = styled.div`
  display: flex;
  gap: 1rem;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Body = styled(Body2)`
  color: ${(props) => props.theme.textSecondary};
`;

const Icon = styled.div`
  display: flex;
  color: ${(props) => props.theme.iconTertiary};
`;

const NotificationBlock = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  align-items: center;
`;

const CheckboxBlock = styled.span`
  margin: 1rem 0;
  display: flex;
`;
const DisclaimerBlock = styled.div`
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  width: 100%;

  background: ${(props) => props.theme.backgroundContent};
  border-radius: ${(props) => props.theme.cornerSmall};
`;

const DisclaimerText = styled(Label2)`
  display: block;
`;

const DisclaimerLink = styled(Label2)`
  cursor: pointer;
  color: ${(props) => props.theme.textSecondary};
  margin-right: 1rem;
`;

const Disclaimer: FC<{
  termsOfUse?: string;
  privacyPolicy?: string;
}> = ({ termsOfUse, privacyPolicy }) => {
  const { t } = useTranslation();
  const sdk = useAppSdk();
  return (
    <DisclaimerBlock>
      <DisclaimerText>{t('You_are_opening_an_external_app')}</DisclaimerText>
      {termsOfUse || privacyPolicy ? (
        <div>
          {termsOfUse && (
            <DisclaimerLink onClick={() => sdk.openPage(termsOfUse)}>
              {t('Terms_Of_Use')}
            </DisclaimerLink>
          )}
          {privacyPolicy && (
            <DisclaimerLink onClick={() => sdk.openPage(privacyPolicy)}>
              {t('Privacy_Policy')}
            </DisclaimerLink>
          )}
        </div>
      ) : undefined}
    </DisclaimerBlock>
  );
};

const useHideDisclaimerMutation = (title: string, kind: 'buy' | 'sell') => {
  const storage = useStorage();
  const client = useQueryClient();
  return useMutation<void, Error, boolean>(async (hide) => {
    await storage.set<boolean>(`${kind}_${title}`, hide);
    await client.invalidateQueries([title, kind]);
  });
};

const useShowDisclaimer = (title: string, kind: 'buy' | 'sell') => {
  const storage = useStorage();
  return useQuery([title, kind], async () => {
    const hided = await storage.get<boolean>(`${kind}_${title}`);
    return hided === null ? false : hided;
  });
};

export const BuyItemNotification: FC<{
  item: BuyItem;
  kind: 'buy' | 'sell';
}> = ({ item, kind }) => {
  const sdk = useAppSdk();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data: hided } = useShowDisclaimer(item.title, kind);
  const { mutate } = useHideDisclaimerMutation(item.title, kind);

  const onForceOpen = () => {
    sdk.openPage(item.link);
  };
  const onOpen = () => {
    if (hided) {
      sdk.openPage(item.link);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <SettingsListItem key={item.title} onClick={onOpen}>
        <ItemPayload>
          <Description>
            <Logo src={item.logo} />
            <Text>
              <Label1>{item.title}</Label1>
              <Body>{t(item.description)}</Body>
            </Text>
          </Description>
          <Icon>
            <ChevronRightIcon />
          </Icon>
        </ItemPayload>
      </SettingsListItem>
      <Notification isOpen={open} handleClose={() => setOpen(false)}>
        <NotificationBlock>
          <Logo large src={item.logo} />
          <H2>{item.title}</H2>
          <Body>{t(item.description)}</Body>
          <Disclaimer
            privacyPolicy={item.privacyPolicy}
            termsOfUse={item.termsOfUse}
          />
          <Button size="large" fullWith primary onClick={onForceOpen}>
            {t('Open')} {item.title}
          </Button>
          <CheckboxBlock>
            <Checkbox checked={!!hided} onChange={mutate}>
              {t('Do_not_show_again')}
            </Checkbox>
          </CheckboxBlock>
        </NotificationBlock>
      </Notification>
    </>
  );
};
