import { SettingsLegal } from '@tonkeeper/uikit/dist/components/settings/SettingsLegal';
import { SettingsRoute } from '@tonkeeper/uikit/dist/libs/routes';
import { Route, Routes } from 'react-router-dom';
import { Localization } from './Localication';
import { Settings } from './Settigns';

export const SettingsRouter = () => {
  return (
    <Routes>
      <Route path={SettingsRoute.localization} element={<Localization />} />
      <Route path={SettingsRoute.legal} element={<SettingsLegal />} />
      <Route path="*" element={<Settings />} />
    </Routes>
  );
};
