import { InfiniteData } from '@tanstack/react-query';
import {
  AccountEvent,
  AccountEvents,
  AccountEvents200Response,
} from '@tonkeeper/core/dist/tonApi';

export const formatActivityDate = (
  language: string,
  key: string,
  timestamp: number
): string => {
  const date = new Date(timestamp * 1000);
  if (key === 'today' || key === 'yesterday' || key.startsWith('week')) {
    return new Intl.DateTimeFormat(language, { timeStyle: 'short' }).format(
      date
    );
  } else {
    return new Intl.DateTimeFormat(language, { dateStyle: 'short' }).format(
      date
    );
  }
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getActivityTitle = (
  language: string,
  key: string,
  timestamp: number
) => {
  const date = new Date(timestamp * 1000);
  switch (key) {
    case 'today':
      return capitalize(
        new Intl.RelativeTimeFormat(language, { numeric: 'auto' }).format(
          0,
          'day'
        )
      );
    case 'yesterday':
      return capitalize(
        new Intl.RelativeTimeFormat(language, { numeric: 'auto' }).format(
          -1,
          'day'
        )
      );
    case 'month':
      return capitalize(
        new Intl.DateTimeFormat(language, { month: 'long' }).format(date)
      );
    default: {
      if (key.startsWith('week')) {
        return capitalize(
          new Intl.DateTimeFormat(language, { weekday: 'long' }).format(date)
        );
      } else {
        return capitalize(
          new Intl.DateTimeFormat(language, {
            month: 'long',
            year: 'numeric',
          }).format(date)
        );
      }
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
    return `week-${date.getDay()}`;
  }
  if (
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  ) {
    return 'month';
  }
  return `year-${date.getFullYear()}-${date.getMonth() + 1}`;
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

  Object.entries(rest)
    .filter(([key]) => key.startsWith('week'))
    .forEach((value) => result.push(value));

  if (month) {
    result.push(['month', month]);
  }

  Object.entries(rest)
    .filter(([key]) => key.startsWith('year'))
    .forEach((value) => result.push(value));

  return result;
};
