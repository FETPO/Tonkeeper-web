import {
  Address,
  WalletContractV3R1,
  WalletContractV3R2,
  WalletContractV4,
} from 'ton';
import { KeyPair, mnemonicToPrivateKey, sha512 } from 'ton-crypto';
import { WalletState, WalletVersion } from '../entries/wallet';
import { Configuration, WalletApi } from '../tonApi';
import { encrypt } from './cryptoService';

export const importWallet = async (
  tonApiConfig: Configuration,
  mnemonic: string[],
  password: string,
  name?: string
): Promise<WalletState> => {
  const tonkeeperId = (await sha512(mnemonic.join(' '))).toString('hex');
  console.log(tonkeeperId);

  const encryptedMnemonic = await encrypt(mnemonic.join(' '), password);
  const keyPair = await mnemonicToPrivateKey(mnemonic);
  const [version, address] = await findContract(tonApiConfig, keyPair);

  return {
    name,
    revision: 0,
    mnemonic: encryptedMnemonic,
    address: address.toRawString(),
    publicKey: keyPair.publicKey.toString('hex'),
    version,
    tonkeeperId,
  };
};

const findContract = async (
  tonApiConfig: Configuration,
  keyPair: KeyPair
): Promise<readonly [WalletVersion, Address]> => {
  const api = new WalletApi(tonApiConfig);
  const result = await api.findWalletsByPubKey({
    publicKey: keyPair.publicKey.toString('hex'),
  });

  const wallet = result.wallets.find(
    (wallet) => wallet.balance > 0 || wallet.status === 'active'
  );
  if (wallet) {
    const detectedVersion = wallet.interfaces.find((value) =>
      value.startsWith('wallet')
    );
    if (
      detectedVersion &&
      ['wallet_v3R1', 'wallet_v3R2', 'wallet_v4R2'].includes(detectedVersion)
    ) {
      const version = detectedVersion.replace('wallet_', '') as WalletVersion;
      return [version, Address.parse(wallet.address)] as const;
    }
  }

  const contact = WalletContractV4.create({
    workchain: 0,
    publicKey: keyPair.publicKey,
  });
  return ['v4R2', contact.address] as const;
};

export const getAddress = (
  publicKey: Buffer,
  version: WalletVersion,
  raw = true
) => {
  switch (version) {
    case 'v3R1': {
      const contact = WalletContractV3R1.create({
        workchain: 0,
        publicKey,
      });
      return raw
        ? contact.address.toRawString()
        : contact.address.toString({ urlSafe: true, bounceable: true });
    }
    case 'v3R2': {
      const contact = WalletContractV3R2.create({
        workchain: 0,
        publicKey,
      });
      return raw
        ? contact.address.toRawString()
        : contact.address.toString({ urlSafe: true, bounceable: true });
    }
    case 'v4R2': {
      const contact = WalletContractV4.create({
        workchain: 0,
        publicKey,
      });
      return raw
        ? contact.address.toRawString()
        : contact.address.toString({ urlSafe: true, bounceable: true });
    }
  }
};

export const updateWalletVersion = (
  wallet: WalletState,
  version: WalletVersion
): WalletState => {
  return {
    ...wallet,
    revision: wallet.revision + 1,
    version: version,
    address: getAddress(Buffer.from(wallet.publicKey, 'hex'), version),
  };
};

export const updateWalletName = (
  wallet: WalletState,
  name: string
): WalletState => {
  return {
    ...wallet,
    revision: wallet.revision + 1,
    name: name,
  };
};
