import { toShortAddress } from '@tonkeeper/core/dist/utils/common';
import React, { useMemo, useState } from 'react';
import { ImportNotification } from '../../components/create/ImportNotification';
import { PlusIcon } from '../../components/Icon';
import { ColumnText } from '../../components/Layout';
import { ListBlock, ListItem, ListItemPayload } from '../../components/List';
import { SettingsList } from '../../components/settings/SettingsList';
import { SubHeader } from '../../components/SubHeader';
import { useAppContext, useWalletContext } from '../../hooks/appContext';
import { useTranslation } from '../../hooks/translation';

export const Account = () => {
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation();

  const { account } = useAppContext();
  const wallet = useWalletContext();

  const createItems = useMemo(() => {
    return [
      {
        name: t('Set_up_wallet'),
        icon: <PlusIcon />,
        action: () => setOpen(true),
      },
    ];
  }, []);

  return (
    <>
      <SubHeader title={t('Manage_wallets')} />
      <ListBlock>
        {account.wallets.map((item, index) => (
          <ListItem key={item.address}>
            <ListItemPayload>
              <ColumnText
                text={wallet.name ? wallet.name : `${t('Wallet')} ${index + 1}`}
                secondary={toShortAddress(wallet.address)}
              />
            </ListItemPayload>
          </ListItem>
        ))}
      </ListBlock>
      <SettingsList items={createItems} />
      <ImportNotification isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};
