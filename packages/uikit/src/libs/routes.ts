export enum AppRoute {
  settings = '/settings',
  activity = '/activity',
  home = '/',
}

export enum SettingsRoute {
  index = '/',
  localization = '/localization',
  legal = '/legal',
}

export const any = (route: string): string => {
  return `${route}/*`;
};

export const relative = (path: string): string => {
  return `.${path}`;
};