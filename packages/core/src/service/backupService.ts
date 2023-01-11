import { getSecureRandomBytes, keyPairFromSeed, sign } from 'ton-crypto';
import { BackupApi, Configuration } from '../tonApi';

const tenMin = 10 * 60;

const createExpireTimestamp = () => {
  const timestamp = Math.round(Date.now() / 1000) + tenMin;
  const timestampBuffer = Buffer.allocUnsafe(8);
  timestampBuffer.writeBigInt64LE(BigInt(timestamp));

  return timestampBuffer;
};

const createVoucher = async () => {
  const voucherSeed = await getSecureRandomBytes(32);
  const voucherKeypair = keyPairFromSeed(voucherSeed);

  const voucherBody = Buffer.concat([
    createExpireTimestamp(),
    voucherKeypair.publicKey,
  ]);

  const voucher = Buffer.concat([
    sign(voucherBody, voucherKeypair.secretKey),
    voucherBody,
  ]);

  return [voucherKeypair, voucher] as const;
};

const createBody = async (publicKey: string, payload = Buffer.alloc(0)) => {
  const primaryPublicKey = Buffer.from(publicKey, 'hex');

  const [voucherKeypair, voucher] = await createVoucher();

  const requestBody = Buffer.concat([
    primaryPublicKey,
    voucher,
    createExpireTimestamp(),
    payload,
  ]);

  const body = Buffer.concat([
    sign(requestBody, voucherKeypair.secretKey),
    requestBody,
  ]);

  return new Blob([body]);
};

export const deleteWalletBackup = async (
  tonApi: Configuration,
  publicKey: string
) => {
  const body = await createBody(publicKey);
  await new BackupApi(tonApi).deleteWalletConfig({ body });
};

export const getWalletBackup = async (
  tonApi: Configuration,
  publicKey: string
) => {
  const body = await createBody(publicKey);
  return new BackupApi(tonApi).getWalletConfig({ body });
};

export const putWalletBackup = async (
  tonApi: Configuration,
  publicKey: string,
  payload: Buffer
) => {
  const body = await createBody(publicKey, payload);
  await new BackupApi(tonApi).putWalletConfig({ body });
};
