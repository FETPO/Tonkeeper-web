export * from './Storage';

import { Configuration, RawBlockchainApi } from 'tonapi-sdk-js';

// Get list of transactions
export const blockchainApi = new RawBlockchainApi(
  new Configuration({
    headers: {
      // To get unlimited requests
      Authorization: 'Bearer YOUR_TOKEN_FROM_TELEGRAM_BOT',
    },
  })
);
