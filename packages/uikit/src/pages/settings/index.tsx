import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SettingsRoute } from '../../libs/routes';
import { DevSettings } from './Dev';
import { FiatCurrency } from './FiatCurrency';
import { Legal } from './Legal';
import { Localization } from './Localization';
import { Settings } from './Settings';
import { UserTheme } from './Theme';

const SettingsRouter = () => {
  return (
    <Routes>
      <Route path={SettingsRoute.localization} element={<Localization />} />
      <Route path={SettingsRoute.legal} element={<Legal />} />
      <Route path={SettingsRoute.theme} element={<UserTheme />} />
      <Route path={SettingsRoute.dev} element={<DevSettings />} />
      <Route path={SettingsRoute.fiat} element={<FiatCurrency />} />
      <Route path="*" element={<Settings />} />
    </Routes>
  );
};

export default SettingsRouter;
