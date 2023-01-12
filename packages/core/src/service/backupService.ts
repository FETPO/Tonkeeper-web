import { sign } from 'ton-crypto';
import { FiatCurrencies } from '../entries/fiat';
import { Language } from '../entries/language';
import { Network } from '../entries/network';
import { WalletProxy } from '../entries/proxy';
import { WalletState, WalletVersion, WalletVoucher } from '../entries/wallet';
import { BackupApi, Configuration } from '../tonApi';

const tenMin = 10 * 60;

const createExpireTimestamp = () => {
  const timestamp = Math.round(Date.now() / 1000) + tenMin;
  const timestampBuffer = Buffer.allocUnsafe(8);
  timestampBuffer.writeBigInt64LE(BigInt(timestamp));

  return timestampBuffer;
};

const createVoucher = async (keyPair: WalletVoucher) => {
  const voucherBody = Buffer.concat([
    createExpireTimestamp(),
    Buffer.from(keyPair.publicKey, 'hex'),
  ]);

  const voucher = Buffer.concat([
    sign(voucherBody, Buffer.from(keyPair.secretKey, 'hex')),
    voucherBody,
  ]);

  return voucher;
};

const createBody = async (
  publicKey: string,
  keyPair: WalletVoucher,
  payload = Buffer.alloc(0)
) => {
  const primaryPublicKey = Buffer.from(publicKey, 'hex');

  const voucher = await createVoucher(keyPair);

  const requestBody = Buffer.concat([
    primaryPublicKey,
    voucher,
    createExpireTimestamp(),
    payload,
  ]);

  const body = Buffer.concat([
    sign(requestBody, Buffer.from(keyPair.secretKey, 'hex')),
    requestBody,
  ]);

  return new Blob([body]);
};

export const deleteWalletBackup = async (
  tonApi: Configuration,
  publicKey: string,
  voucher: WalletVoucher
) => {
  const body = await createBody(publicKey, voucher);
  await new BackupApi(tonApi).deleteWalletConfig({ body });
};

export const getWalletBackup = async (
  tonApi: Configuration,
  publicKey: string,
  voucher: WalletVoucher
) => {
  const body = await createBody(publicKey, voucher);
  return new BackupApi(tonApi).getWalletConfig({ body });
};

export const putWalletBackup = async (
  tonApi: Configuration,
  publicKey: string,
  voucher: WalletVoucher,
  payload: Buffer
) => {
  const body = await createBody(publicKey, voucher, payload);
  await new BackupApi(tonApi).putWalletConfig({ body });
};

const writeBase = (base: number[]) => {
  const buf = Buffer.allocUnsafe(4 * base.length);
  for (const item of base) {
    buf.writeInt32BE(item);
  }
  return buf;
};

export const createWalletBackup = (wallet: WalletState): Buffer => {
  const backupVersion = 0;
  const revision = wallet.revision;
  const version = wallet.active.version;
  const network = wallet.network ?? Network.MAINNET;
  const lang = wallet.lang ?? Language.en;
  const proxy = wallet.proxy ?? WalletProxy.off;

  const body = [backupVersion, revision, version, network, lang, proxy];

  const payload = Buffer.concat([
    writeBase(body),
    Buffer.from(wallet.fiat ?? FiatCurrencies.USD, 'utf8'),
  ]);

  return payload;
};

export const readWalletBackup = (payload: Buffer) => {
  const backupVersion = payload.readInt32BE(0);
  if (backupVersion != 0) {
    throw new Error('Unexpected version');
  }
  const revision = payload.readInt32BE(4);
  const version: WalletVersion = payload.readInt32BE(8);
  const network: Network = payload.readInt32BE(12);
  const lang: Language = payload.readInt32BE(16);
  const proxy: Language = payload.readInt32BE(20);

  const fiat = payload
    .subarray(24, 24 + 8 * 3)
    .toString('utf8') as FiatCurrencies;

  return {
    revision,
    version,
    network,
    lang,
    proxy,
    fiat,
  };
};
