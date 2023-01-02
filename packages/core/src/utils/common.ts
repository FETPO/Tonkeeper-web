import { Address } from 'ton-core';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const toShortAddress = (address: string, length = 4): string => {
  address = Address.parse(address).toString();
  return address.slice(0, length) + '....' + address.slice(-length);
};
