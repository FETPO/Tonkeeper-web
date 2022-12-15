import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SettingsRoute } from '../../libs/routes';
import { Legal } from './Legal';
import { Localization } from './Localication';
import { Settings } from './Settigns';

export const SettingsRouter = () => {
  return (
    <Routes>
      <Route path={SettingsRoute.localization} element={<Localization />} />
      <Route path={SettingsRoute.legal} element={<Legal />} />
      <Route path="*" element={<Settings />} />
    </Routes>
  );
};
