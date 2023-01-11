import { Address } from 'ton-core';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const toShortAddress = (address: string, length = 4): string => {
  return address.slice(0, length) + '....' + address.slice(-length);
};

export function formatTransferUrl(
  address: string,
  amount?: string,
  text?: string
) {
  let url = 'ton://transfer/' + Address.parse(address).toString();

  const params = [];

  if (amount) {
    params.push('amount=' + amount);
  }
  if (text) {
    params.push('text=' + encodeURIComponent(text));
  }

  if (params.length === 0) return url;

  return url + '?' + params.join('&');
}
