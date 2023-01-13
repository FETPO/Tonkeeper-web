import React from 'react';
import { ListBlock, ListItem, ListItemPayload } from '../../components/List';
import { SubHeader } from '../../components/SubHeader';
import { Switch } from '../../components/Switch';
import { Label1 } from '../../components/Text';
import { useTranslation } from '../../hooks/translation';
import { useLookScreen, useMutateLookScreen } from '../../state/password';

const LockSwitch = () => {
  const { t } = useTranslation();

  const { data } = useLookScreen();
  const { mutate } = useMutateLookScreen();

  return (
    <ListBlock>
      <ListItem hover={false}>
        <ListItemPayload>
          <Label1>{t('Lock_screen')}</Label1>
          <Switch checked={!!data} onChange={mutate} />
        </ListItemPayload>
      </ListItem>
    </ListBlock>
  );
};

export const SecuritySettings = () => {
  const { t } = useTranslation();
  return (
    <>
      <SubHeader title={t('Security')} />
      <LockSwitch />
    </>
  );
};
