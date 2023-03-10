import React, { FC, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { AppRoute } from '../../libs/routes';
import { BackButton } from '../fields/BackButton';
import { Button } from '../fields/Button';
import { ChevronLeftIcon } from '../Icon';
import { Body1, Body2, H2, Label2 } from '../Text';

const Block = styled.div`
  display: flex;
  text-align: center;
  gap: 1rem;
  flex-direction: column;

  & + & {
    margin-top: 2rem;
  }
`;

const Header = styled(H2)`
  user-select: none;
`;
const Body = styled(Body1)`
  user-select: none;

  text-align: center;
  color: ${(props) => props.theme.textSecondary};
`;

export const WorldsGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(12, minmax(0, 1fr));
  grid-auto-flow: column;
  gap: 0.5rem;
  place-content: space-evenly;
  margin: 1rem 0;

  white-space: normal;
`;

const World = styled(Body1)``;

export const WorldNumber = styled(Body2)`
  display: inline-block;
  width: 24px;
  line-height: 24px;
  color: ${(props) => props.theme.textSecondary};

  user-select: none;
`;

const Number1 = styled(Body1)`
  display: inline-block;
  width: 26px;
  text-align: right;

  font-size: 15px;

  color: ${(props) => props.theme.textSecondary};
`;

const LogoutButtonBlock = styled.div`
  flex-shrink: 0;

  cursor: pointer;
  padding: 6px 12px;
  border-radius: ${(props) => props.theme.cornerMedium};
  color: ${(props) => props.theme.textPrimary};
  background: ${(props) => props.theme.backgroundContent};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }
`;

export const ButtonRow = styled.div`
  display: flex;
`;

export const LogoutBlock = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

export const BackBlock = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
`;
export const LogoutButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <LogoutButtonBlock onClick={() => navigate(AppRoute.home)}>
      <Label2>{t('settings_reset')}</Label2>
    </LogoutButtonBlock>
  );
};

export const Worlds: FC<{
  mnemonic: string[];
  onBack: () => void;
  onCheck: () => void;
}> = ({ mnemonic, onBack, onCheck }) => {
  const { t } = useTranslation();
  return (
    <>
      <BackBlock>
        <BackButton onClick={onBack}>
          <ChevronLeftIcon />
        </BackButton>
      </BackBlock>
      <Block>
        <div>
          <Header>{t('secret_words_title')}</Header>
          <Body>{t('secret_words_caption')}</Body>
        </div>
      </Block>

      <WorldsGrid>
        {mnemonic.map((world, index) => (
          <World key={index}>
            <WorldNumber> {index + 1}.</WorldNumber> {world}{' '}
          </World>
        ))}
      </WorldsGrid>

      <Button size="large" fullWidth primary marginTop onClick={onCheck}>
        {t('create_wallet_continue_button')}
      </Button>
    </>
  );
};

const Input = styled.input`
  outline: none;
  border: none;
  background: transparent;
  flex-grow: 1;
  font-weight: 500;
  font-size: 16px;

  color: ${(props) => props.theme.textPrimary};
`;

const InputBlock = styled.label<{ active: boolean; valid: boolean }>`
  width: 100%;
  line-height: 54px;
  border-radius: ${(props) => props.theme.cornerSmall};
  padding: 0 1rem;
  box-sizing: border-box;
  text-align: left;

  ${(props) =>
    props.active
      ? css`
          border: 1px solid ${props.theme.fieldActiveBorder};
          background: ${props.theme.fieldBackground};
        `
      : !props.valid
      ? css`
          border: 1px solid ${props.theme.fieldErrorBorder};
          background: ${props.theme.fieldErrorBackground};
        `
      : css`
          border: 1px solid ${props.theme.fieldBackground};
          background: ${props.theme.fieldBackground};
        `}

  ${Number1} {
    display: inline-block;
    line-height: 54px;
    padding-right: 0.35rem;
  }
  ${Input} {
    display: inline-block;
    width: calc(100% - 38px);
    height: 54px;
    line-height: 54px;
    box-sizing: border-box;
  }
`;

const WordInput: FC<{
  value: string;
  onChange: (value: string) => void;
  test: number;
  valid: string;
}> = ({ value, test, onChange, valid }) => {
  const [active, setActive] = useState(false);

  const isValid = value === '' || (value === valid && active === false);
  return (
    <InputBlock active={active} valid={isValid}>
      <Number1>{test}:</Number1>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      />
    </InputBlock>
  );
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const formatOrdinals = (lang: string, n: number) => {
  if (lang === 'en') {
    const pr = new Intl.PluralRules(lang, { type: 'ordinal' });
    const suffixes = new Map([
      ['one', 'st'],
      ['two', 'nd'],
      ['few', 'rd'],
      ['other', 'th'],
    ]);

    const rule = pr.select(n);
    const suffix = suffixes.get(rule);
    return `${n}${suffix}`;
  } else {
    return `${n}`;
  }
};

export const Check: FC<{
  mnemonic: string[];
  onBack: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}> = ({ onBack, onConfirm, mnemonic, isLoading }) => {
  const { t, i18n } = useTranslation();

  const [one, setOne] = useState('');
  const [two, setTwo] = useState('');
  const [three, setThree] = useState('');

  const [test1, test2, test3] = useMemo(() => {
    return [getRandomInt(1, 8), getRandomInt(8, 16), getRandomInt(16, 24)];
  }, []);

  const description = useMemo(() => {
    return t('check_words_caption')
      .replace(`%1%`, formatOrdinals(i18n.language, test1))
      .replace(`%2%`, formatOrdinals(i18n.language, test2))
      .replace(`%3%`, formatOrdinals(i18n.language, test3));
  }, [t, test1, test2, test3]);

  const isValid =
    one.toLowerCase().trim() === mnemonic[test1 - 1] &&
    two.toLowerCase().trim() === mnemonic[test2 - 1] &&
    three.toLowerCase().trim() === mnemonic[test3 - 1];

  return (
    <>
      <BackBlock>
        <BackButton onClick={onBack}>
          <ChevronLeftIcon />
        </BackButton>
      </BackBlock>
      <Block>
        <div>
          <Header>{t('check_words_title')}</Header>
          <Body>{description}</Body>
        </div>
      </Block>

      <Block>
        <WordInput
          test={test1}
          value={one}
          onChange={setOne}
          valid={mnemonic[test1 - 1]}
        />
        <WordInput
          test={test2}
          value={two}
          onChange={setTwo}
          valid={mnemonic[test2 - 1]}
        />
        <WordInput
          test={test3}
          value={three}
          onChange={setThree}
          valid={mnemonic[test3 - 1]}
        />
      </Block>
      <Block>
        <Button
          size="large"
          fullWidth
          primary
          loading={isLoading}
          disabled={!isValid}
          onClick={onConfirm}
        >
          {t('create_wallet_continue_button')}
        </Button>
      </Block>
    </>
  );
};

const Inputs = styled.div`
  display: grid;
  grid-template-rows: repeat(12, minmax(0, 1fr));
  grid-auto-flow: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-rows: repeat(24, minmax(0, 1fr));
  }
`;

export const ImportWords: FC<{
  isLoading: boolean;
  onMnemonic: (mnemonic: string[]) => void;
}> = ({ isLoading, onMnemonic }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [mnemonic, setMnemonic] = useState<string[]>(Array(24).fill(''));

  const onChange = useCallback((newValue: string, index: number) => {
    if (newValue.includes(' ')) {
      let values = newValue.split(' ');
      const max = Math.min(24 - index, values.length);
      values = values.slice(0, max);
      return setMnemonic((items) => {
        items = [...items];
        items.splice(index, max, ...values);
        return items;
      });
    } else {
      return setMnemonic((items) =>
        items.map((v, i) => (i === index ? newValue : v))
      );
    }
  }, []);

  const isValid = useMemo(
    () => mnemonic.length === 24 && mnemonic.every((item) => item != ''),
    [mnemonic]
  );

  return (
    <>
      <BackBlock>
        <BackButton onClick={() => navigate(AppRoute.home)}>
          <ChevronLeftIcon />
        </BackButton>
      </BackBlock>
      <Block>
        <div>
          <Header>{t('import_wallet_title')}</Header>
          <Body>{t('import_wallet_caption')}</Body>
        </div>
      </Block>
      <Block>
        <Inputs>
          {mnemonic.map((item, index) => (
            <WordInput
              key={index}
              value={item}
              test={index + 1}
              valid={item}
              onChange={(newValue) => onChange(newValue, index)}
            />
          ))}
        </Inputs>
      </Block>
      <Block>
        <Button
          size="large"
          fullWidth
          primary
          disabled={!isValid}
          loading={isLoading}
          onClick={() => onMnemonic(mnemonic)}
        >
          {t('create_wallet_continue_button')}
        </Button>
      </Block>
    </>
  );
};
