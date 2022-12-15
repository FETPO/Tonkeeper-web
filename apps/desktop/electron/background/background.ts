import { Message } from '../../src/libs/message';
import {
  storageDelete,
  storageGet,
  storageSet,
  storageSetBatch,
} from './storageService';

export const handleBackgroundMessage = async (
  message: Message
): Promise<unknown> => {
  switch (message.king) {
    case 'storage-set':
      return storageSet(message);
    case 'storage-get':
      return storageGet(message);
    case 'storage-set-batch':
      return storageSetBatch(message);
    case 'storage-delete':
      return storageDelete(message);
    default:
      throw new Error(`Unknown message: ${JSON.stringify(message)}`);
  }
};
