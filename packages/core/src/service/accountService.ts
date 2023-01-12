import { AccountState, defaultAccountState } from '../entries/account';
import { AppKey } from '../Keys';
import { IStorage } from '../Storage';
import { Configuration } from '../tonApi';
import { deleteWalletState } from './walletService';

export const getAccountState = async (storage: IStorage) => {
  console.log('load account');
  const state = await storage.get<AccountState>(AppKey.account);
  return state ?? defaultAccountState;
};

export const accountAppendWallet = async (
  storage: IStorage,
  publicKey: string
) => {
  const account = await getAccountState(storage);
  const updated = {
    publicKeys: account.publicKeys.concat([publicKey]),
    activePublicKey: publicKey,
  };
  await storage.set(AppKey.account, updated);
};

export const accountSelectWallet = async (
  storage: IStorage,
  publicKey: string
) => {
  const account = await getAccountState(storage);
  const updated = {
    publicKeys: account.publicKeys,
    activePublicKey: publicKey,
  };
  await storage.set(AppKey.account, updated);
};

export const accountLogOutWallet = async (
  storage: IStorage,
  tonApi: Configuration,
  publicKey: string,
  removeRemove: boolean = false
) => {
  if (removeRemove) {
    //await deleteWalletBackup(tonApi, publicKey);
  }

  let account = await getAccountState(storage);

  const publicKeys = account.publicKeys.filter((key) => key !== publicKey);
  account = {
    publicKeys,
    activePublicKey: publicKeys.length > 0 ? publicKeys[0] : undefined,
  };

  await deleteWalletState(storage, publicKey);

  await storage.set(AppKey.account, account);
};
