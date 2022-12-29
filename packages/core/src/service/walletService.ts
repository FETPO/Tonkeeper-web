import { Address, WalletContractV4 } from 'ton';
import { KeyPair, mnemonicToPrivateKey } from 'ton-crypto';
import { WalletState, WalletVersion } from '../entries/wallet';
import { Configuration, WalletApi } from '../tonApi';
import { encrypt } from './cryptoService';

export const importWallet = async (
  tonApiConfig: Configuration,
  mnemonic: string[],
  password: string
): Promise<WalletState> => {
  const encryptedMnemonic = await encrypt(mnemonic.join(' '), password);
  const keyPair = await mnemonicToPrivateKey(mnemonic);
  const [version, address] = await findContract(tonApiConfig, keyPair);

  return {
    revision: 0,
    mnemonic: encryptedMnemonic,
    address: address.toString(),
    publicKey: keyPair.publicKey.toString('hex'),
    version,
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
