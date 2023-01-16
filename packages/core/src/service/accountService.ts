import { AccountState, defaultAccountState } from '../entries/account';
import { AuthState } from '../entries/password';
import { AppKey } from '../Keys';
import { IStorage } from '../Storage';
import { Configuration } from '../tonApi';
import { deleteWalletMnemonic } from './menmonicService';
import { deleteWalletState, importWallet } from './walletService';

export const getAccountState = async (storage: IStorage) => {
  console.log('load account');
  const state = await storage.get<AccountState>(AppKey.account);
  return state ?? defaultAccountState;
};

const accountAppendWallet = async (storage: IStorage, publicKey: string) => {
  const account = await getAccountState(storage);
  return {
    publicKeys: account.publicKeys.concat([publicKey]),
    activePublicKey: publicKey,
  };
};

export const accountSetUpWalletState = async (
  storage: IStorage,
  tonApi: Configuration,
  mnemonic: string[],
  auth: AuthState,
  password: string
) => {
  const [encryptedMnemonic, state] = await importWallet(
    tonApi,
    mnemonic,
    password
  );
  const account = await accountAppendWallet(storage, state.publicKey);
  await storage.setBatch({
    [AppKey.account]: account,
    [AppKey.password]: auth,
    [`${AppKey.wallet}_${state.publicKey}`]: state,
    [`${AppKey.mnemonic}_${state.publicKey}`]: encryptedMnemonic,
  });
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
  await deleteWalletMnemonic(storage, publicKey);
  if (account.publicKeys.length === 0) {
    await storage.delete(AppKey.password);
  }
  await storage.set(AppKey.account, account);
};
