import { getSecureRandomBytes, KeyPair, keyPairFromSeed } from 'ton-crypto';
import nacl from 'tweetnacl';
import { WalletVoucher } from '../entries/wallet';

export const sign = (message: Buffer, secretKey: Buffer) => {
  return Buffer.from(
    nacl.sign(new Uint8Array(message), new Uint8Array(secretKey))
  );
};

const hundredYears = 100 * 355 * 24 * 60 * 60;

export const createExpireTimestamp = (expired: number) => {
  const timestamp = Math.round(Date.now() / 1000) + expired;
  const timestampBuffer = Buffer.allocUnsafe(8);
  timestampBuffer.writeBigInt64LE(BigInt(timestamp));

  return timestampBuffer;
};

/**
 * backup.voucher sign:int512 expire_at:int64 publicKey:int256 = backup.Voucher
 */
export const createWalletVoucher = async (
  walletKeyPair: KeyPair
): Promise<WalletVoucher> => {
  const voucherSeed = await getSecureRandomBytes(32);
  const voucherKeypair = keyPairFromSeed(voucherSeed);

  const voucherBody = Buffer.concat([
    createExpireTimestamp(hundredYears),
    voucherKeypair.publicKey,
  ]);

  const voucher = Buffer.concat([
    sign(voucherBody, walletKeyPair.secretKey),
    voucherBody,
  ]);

  return {
    secretKey: voucherKeypair.secretKey.toString('hex'),
    publicKey: voucherKeypair.publicKey.toString('hex'),
    voucher: voucher.toString('hex'),
  };
};
