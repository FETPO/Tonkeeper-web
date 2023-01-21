import { InfiniteData } from '@tanstack/react-query';
import {
  AccountEvent,
  AccountEvents,
  AccountEvents200Response,
} from '@tonkeeper/core/dist/tonApi';

export const formatActivityDate = (key: string, timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  if (key === 'today' || key === 'yesterday') {
    return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
  } else {
    return date.toLocaleDateString();
  }
};

export const getActivityTitle = (key: string, t: (value: string) => string) => {
  switch (key) {
    case 'today':
      return t('Today');
    case 'yesterday':
      return t('Yesterday');
    case 'week':
      return t('This_Week');
    case 'month':
      return t('This_Month');
    default: {
      const [year, month] = key.split('-');
      return `${t('month_' + month)} ${year}`;
    }
  }
};

const getWeek = (date: Date) => {
  var onejan = new Date(date.getFullYear(), 0, 1).getTime();
  var today = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
  var dayOfYear = (today - onejan + 86400000) / 86400000;
  return Math.ceil(dayOfYear / 7);
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
    getWeek(today) === getWeek(date) &&
    today.getFullYear() === date.getFullYear()
  ) {
    return 'week';
  }
  if (
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  ) {
    return 'month';
  }
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
};

export interface ActivityItem {
  timestamp: number;
  event: AccountEvent;
}

export type ActivityGroup = [string, ActivityItem[]];

export const groupJettonEvents = (data: AccountEvents) => {
  data.nextFrom;
};
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

  const { today, yesterday, week, month, ...rest } = list.reduce(
    (acc, item) => {
      const group = getEventGroup(item.timestamp, todayDate, yesterdayDate);
      if (acc[group]) {
        acc[group].push(item);
      } else {
        acc[group] = [item];
      }
      return acc;
    },
    {} as Record<string, ActivityItem[]>
  );

  const result = [] as [] as ActivityGroup[];
  if (today) {
    result.push(['today', today]);
  }
  if (yesterday) {
    result.push(['yesterday', yesterday]);
  }
  if (week) {
    result.push(['week', week]);
  }
  if (month) {
    result.push(['month', month]);
  }
  result.push(...Object.entries(rest));

  return result;
};
