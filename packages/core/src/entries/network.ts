export type Network = 'mainnet' | 'testnet';

export const defaultNetwork = 'mainnet';

export const switchNetwork = (current: Network): Network => {
  return current === 'mainnet' ? 'testnet' : 'mainnet';
};
