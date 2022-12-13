import { SettingsRoute } from '@tonkeeper/uikit/dist/libs/routes';
import { Route, Routes } from 'react-router-dom';
import { Localization } from './Localication';
import { Settings } from './Settigns';

export const SettingsRouter = () => {
  return (
    <Routes>
      <Route path={SettingsRoute.localization} element={<Localization />} />
      <Route path="*" element={<Settings />} />
    </Routes>
  );
};
