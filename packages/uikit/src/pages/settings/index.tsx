import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SettingsRoute } from '../../libs/routes';
import { Legal } from './Legal';
import { Localization } from './Localization';
import { Settings } from './Settigns';
import { UserTheme } from './Theme';

export default SettingsRouter = () => {
  return (
    <Routes>
      <Route path={SettingsRoute.localization} element={<Localization />} />
      <Route path={SettingsRoute.legal} element={<Legal />} />
      <Route path={SettingsRoute.theme} element={<UserTheme />} />
      <Route path="*" element={<Settings />} />
    </Routes>
  );
};
