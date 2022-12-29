import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { mnemonicNew } from 'ton-crypto';
import { Button } from '../../components/Button';
import { Check, Worlds } from '../../components/create/Words';
import { CheckMarkIcon, GearIcon, WriteIcon } from '../../components/Icon';
import { IconPage } from '../../components/Layout';
import { useTranslation } from '../../hooks/translation';
import { useAuthState } from '../../state/password';
const Blue = styled.span`
  color: ${(props) => props.theme.accentBlue};
`;

const Green = styled.span`
  color: ${(props) => props.theme.accentGreen};
`;

export const Create = () => {
  const { t } = useTranslation();

  const { data: auth } = useAuthState();
  const [mnemonic, setMnemonic] = useState<string[]>([]);

  const [create, setCreate] = useState(false);
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      mnemonicNew(24).then((value) => setMnemonic(value));
    }, 1500);
  }, []);

  useEffect(() => {
    if (mnemonic.length) {
      setTimeout(() => {
        setCreate(true);
      }, 1500);
    }
  }, [mnemonic]);

  if (mnemonic.length === 0) {
    return (
      <IconPage
        icon={
          <Blue>
            <GearIcon />
          </Blue>
        }
        title={t('Generating_wallet')}
      />
    );
  }

  if (!create) {
    return (
      <IconPage
        icon={
          <Green>
            <CheckMarkIcon />
          </Green>
        }
        title={t('Your_wallet_has_just_been_created')}
      />
    );
  }

  if (!open) {
    return (
      <IconPage
        icon={
          <Blue>
            <WriteIcon />
          </Blue>
        }
        title={t('Grab_a_pen')}
        description={t('Grab_a_pen_description')}
        button={
          <Button
            size="large"
            fullWith
            primary
            bottom
            onClick={() => setOpen(true)}
          >
            {t('Continue')}
          </Button>
        }
      />
    );
  }

  if (!check) {
    return (
      <Worlds
        mnemonic={mnemonic}
        onBack={() => setOpen(false)}
        onCheck={() => setCheck(true)}
      />
    );
  }

  if (!checked) {
    return (
      <Check
        mnemonic={mnemonic}
        onBack={() => setCheck(false)}
        onConfirm={() => setChecked(true)}
      />
    );
  }

  return (
    <IconPage
      icon={
        <Green>
          <CheckMarkIcon />
        </Green>
      }
      title={t('Congratulations_You_ve_set_up_your_wallet')}
    />
  );
};
