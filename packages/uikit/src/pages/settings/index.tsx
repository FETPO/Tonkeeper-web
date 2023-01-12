import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SettingsRoute } from '../../libs/routes';
import { Account } from './Account';
import { DevSettings } from './Dev';
import { FiatCurrency } from './FiatCurrency';
import { JettonsSettings } from './Jettons';
import { Legal } from './Legal';
import { Localization } from './Localization';
import { ActiveRecovery, Recovery } from './Recovery';
import { UserTheme } from './Theme';
import { WalletVersion } from './Version';

const SettingsRouter = () => {
  return (
    <Routes>
      <Route path={SettingsRoute.localization} element={<Localization />} />
      <Route path={SettingsRoute.legal} element={<Legal />} />
      <Route path={SettingsRoute.theme} element={<UserTheme />} />
      <Route path={SettingsRoute.dev} element={<DevSettings />} />
      <Route path={SettingsRoute.fiat} element={<FiatCurrency />} />
      <Route path={SettingsRoute.account} element={<Account />} />
      <Route path={SettingsRoute.recovery} element={<ActiveRecovery />}>
        <Route path=":publicKey" element={<Recovery />} />
      </Route>
      <Route path={SettingsRoute.version} element={<WalletVersion />} />
      <Route path={SettingsRoute.jettons} element={<JettonsSettings />} />
    </Routes>
  );
};

export default SettingsRouter;
