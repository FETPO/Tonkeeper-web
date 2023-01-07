import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  DeleteWalletNotification,
  LogOutWalletNotification,
} from '../../components/settings/LogOutNotification';
import { RenameWalletNotification } from '../../components/settings/WalletNameNotification';
import { SettingsRoute } from '../../libs/routes';
import { Account } from './Account';
import { DevSettings } from './Dev';
import { FiatCurrency } from './FiatCurrency';
import { JettonsSettings } from './Jettons';
import { Legal } from './Legal';
import { Localization } from './Localization';
import { ActiveRecovery, Recovery } from './Recovery';
import { Settings } from './Settings';
import { UserTheme } from './Theme';
import { WalletVersion } from './Version';

const SettingsRouter = () => {
  return (
    <>
      <Routes>
        <Route path={SettingsRoute.localization} element={<Localization />} />
        <Route path={SettingsRoute.legal} element={<Legal />} />
        <Route path={SettingsRoute.theme} element={<UserTheme />} />
        <Route path={SettingsRoute.dev} element={<DevSettings />} />
        <Route path={SettingsRoute.fiat} element={<FiatCurrency />} />
        <Route path={SettingsRoute.account} element={<Account />} />
        <Route path={SettingsRoute.recovery} element={<ActiveRecovery />}>
          <Route path=":tonkeeperId" element={<Recovery />} />
        </Route>
        <Route path={SettingsRoute.version} element={<WalletVersion />} />
        <Route path={SettingsRoute.jettons} element={<JettonsSettings />} />
        <Route path="*" element={<Settings />} />
      </Routes>
      <DeleteWalletNotification />
      <LogOutWalletNotification />
      <RenameWalletNotification />
    </>
  );
};

export default SettingsRouter;
