import { useQuery } from '@tanstack/react-query';
import { AppKey } from '@tonkeeper/core/dist/Keys';
import { NFTApi, NftItemsRepr } from '@tonkeeper/core/dist/tonApi';
import { useAppContext, useWalletContext } from '../hooks/appContext';

export const useNftInfo = () => {
  const wallet = useWalletContext();
  const { tonApi } = useAppContext();
  return useQuery<NftItemsRepr, Error>(
    [wallet.address, AppKey.nft],
    async () => {
      const result = await new NFTApi(tonApi).searchNFTItems({
        owner: wallet.address,
        offset: 0,
        limit: 10,
      });

      return result;
    }
  );
};
