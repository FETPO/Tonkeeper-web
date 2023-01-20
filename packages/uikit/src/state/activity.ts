import { InfiniteData } from '@tanstack/react-query';
import {
  AccountEvent,
  AccountEvents200Response,
} from '@tonkeeper/core/dist/tonApi';

export const formatActivityDate = (key: string, timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  if (key === 'today' || key === 'yesterday') {
    return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
  } else {
    return `${('0' + date.getDay()).slice(-2)}.${('0' + date.getMonth()).slice(
      -2
    )}`;
  }
};

export const getActivityTitle = (key: string, t: (value: string) => string) => {
  switch (key) {
    case 'today':
      return t('Today');
    case 'yesterday':
      return t('Yesterday');
    case 'month':
      return t('This_Month');
    default: {
      const [year, month] = key.split('-');
      return `${t('month_' + month)} ${year}`;
    }
  }
};

const getEventGroup = (
  timestamp: number,
  today: Date,
  yesterday: Date
): string => {
  const date = new Date(timestamp * 1000);

  if (today.toDateString() === date.toDateString()) {
    return 'today';
  }
  if (yesterday.toDateString() === date.toDateString()) {
    return 'yesterday';
  }
  if (
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  ) {
    return 'month';
  }
  return `${date.getFullYear()}-${date.getMonth()}`;
};

export interface ActivityItem {
  timestamp: number;
  event: AccountEvent;
}

export type ActivityGroup = [string, ActivityItem[]];

export const groupActivity = (data: InfiniteData<AccountEvents200Response>) => {
  const list = [] as ActivityItem[];

  data.pages.forEach((page) => {
    page.events.forEach((event) => {
      list.push({
        timestamp: event.timestamp,
        event,
      });
    });
  });

  list.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

  const todayDate = new Date();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  const { today, yesterday, month, ...rest } = list.reduce((acc, item) => {
    const group = getEventGroup(item.timestamp, todayDate, yesterdayDate);
    if (acc[group]) {
      acc[group].push(item);
    } else {
      acc[group] = [item];
    }
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  const result = [] as [] as ActivityGroup[];
  if (today) {
    result.push(['today', today]);
  }
  if (yesterday) {
    result.push(['yesterday', yesterday]);
  }
  if (month) {
    result.push(['month', month]);
  }
  result.push(...Object.entries(rest));

  return result;
};
