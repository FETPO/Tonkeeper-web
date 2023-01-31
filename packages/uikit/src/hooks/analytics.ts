import { Analytics, logEvent } from 'firebase/analytics';
import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const AnalyticsContext = React.createContext<Analytics>(undefined!);

export const useAnalytics = () => {
  return useContext(AnalyticsContext);
};

export const useAnalyticsScreenView = () => {
  const location = useLocation();
  const analytics = useAnalytics();
  useEffect(() => {
    logEvent(analytics, 'screen_view');
    console.log(analytics, 'screen_view');
  }, [location.pathname]);
};

type AnalyticsEvent =
  | 'screen_view'
  | 'user_engagement'
  | 'session_start'
  | 'first_open';

export const sendAnalyticsEvent = (
  analytics: Analytics,
  eventKind: AnalyticsEvent
) => {
  logEvent(analytics, String(eventKind));
  console.log(analytics, eventKind);
};

export const useFBAnalyticsEvent = (eventKind: AnalyticsEvent) => {
  const analytics = useAnalytics();
  useEffect(() => {
    sendAnalyticsEvent(analytics, eventKind);
  }, []);
};
