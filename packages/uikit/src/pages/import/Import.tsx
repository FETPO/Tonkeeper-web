import React, { useState } from 'react';
import { CreatePassword } from '../../components/create/Password';
import { ImportWords } from '../../components/create/Words';
import {
  FinalView,
  useAddWalletMutation,
  useConfirmMutation,
} from './Password';

export const Import = () => {
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [password, setPassword] = useState(false);

  const {
    mutateAsync: checkPasswordAndCreateWalletAsync,
    isLoading: isConfirmLoading,
  } = useConfirmMutation();

  const { mutateAsync: createWalletAsync, isLoading: isCreateLoading } =
    useAddWalletMutation();

  if (mnemonic.length === 0) {
    return (
      <ImportWords
        isLoading={isConfirmLoading}
        onMnemonic={(mnemonic) => {
          checkPasswordAndCreateWalletAsync({ mnemonic }).then((value) => {
            setMnemonic(mnemonic);
            setPassword(value);
          });
        }}
      />
    );
  }

  if (!password) {
    return (
      <CreatePassword
        afterCreate={(pass) =>
          createWalletAsync({ password: pass, mnemonic }).then(() =>
            setPassword(true)
          )
        }
        isLoading={isCreateLoading}
      />
    );
  }

  return <FinalView />;
};
