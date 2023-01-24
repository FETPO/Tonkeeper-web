import React, { FC, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { AppRoute } from '../../libs/routes';
import { BackButton } from '../fields/BackButton';
import { Button } from '../fields/Button';
import { ChevronLeftIcon } from '../Icon';
import { Body1, Body2, H2 } from '../Text';

const Block = styled.div`
  display: flex;
  text-align: center;
  gap: 1rem;
  flex-direction: column;
  margin-bottom: 1rem;

  & + & {
    margin-top: 1rem;
  }
`;

const Body = styled(Body1)`
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
`;

const World = styled(Body1)``;

export const WorldNumber = styled(Body2)`
  display: inline-block;
  width: 24px;
  line-height: 24px;
  color: ${(props) => props.theme.textSecondary};
`;

const Number1 = styled(Body1)`
  display: inline-block;
  width: 26px;
  text-align: right;
  color: ${(props) => props.theme.textSecondary};
`;

export const Worlds: FC<{
  mnemonic: string[];
  onBack: () => void;
  onCheck: () => void;
}> = ({ mnemonic, onBack, onCheck }) => {
  const { t } = useTranslation();
  return (
    <>
      <Block>
        <BackButton onClick={onBack}>
          <ChevronLeftIcon />
        </BackButton>
        <div>
          <H2>{t('Your_recovery_phrase')}</H2>
          <Body>{t('Your_recovery_phrase_description')}</Body>
        </div>
      </Block>

      <WorldsGrid>
        {mnemonic.map((world, index) => (
          <World key={index}>
            <WorldNumber> {index + 1}.</WorldNumber> {world}{' '}
          </World>
        ))}
      </WorldsGrid>

      <Button size="large" fullWith primary marginTop onClick={onCheck}>
        {t('Continue')}
      </Button>
    </>
  );
};

const InputBlock = styled.label<{ active: boolean; valid: boolean }>`
  width: 100%;
  line-height: 54px;
  border-radius: ${(props) => props.theme.cornerSmall};
  display: flex;
  padding: 0 1rem;
  gap: 0.35rem;
  box-sizing: border-box;

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
    line-height: 54px;
  }
`;

const Input = styled.input`
  outline: none;
  border: none;
  background: transparent;
  flex-grow: 1;
  font-weight: 600;
  font-size: 14px;

  color: ${(props) => props.theme.textPrimary};
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

export const Check: FC<{
  mnemonic: string[];
  onBack: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}> = ({ onBack, onConfirm, mnemonic, isLoading }) => {
  const { t } = useTranslation();

  const [one, setOne] = useState('');
  const [two, setTwo] = useState('');
  const [three, setThree] = useState('');

  const [test1, test2, test3] = useMemo(() => {
    return [getRandomInt(1, 8), getRandomInt(8, 16), getRandomInt(16, 24)];
  }, []);

  const description = useMemo(() => {
    return t('So_let_s_check_description')
      .replace(`%1%`, String(test1))
      .replace(`%2%`, String(test2))
      .replace(`%3%`, String(test3));
  }, [t, test1, test2, test3]);

  const isValid =
    one.toLowerCase().trim() === mnemonic[test1 - 1] &&
    two.toLowerCase().trim() === mnemonic[test2 - 1] &&
    three.toLowerCase().trim() === mnemonic[test3 - 1];

  return (
    <>
      <Block>
        <BackButton onClick={onBack}>
          <ChevronLeftIcon />
        </BackButton>
        <div>
          <H2>{t('So_let_s_check')}</H2>
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

      <Button
        size="large"
        fullWith
        primary
        loading={isLoading}
        disabled={!isValid}
        onClick={onConfirm}
      >
        {t('Continue')}
      </Button>
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
      <Block>
        <BackButton onClick={() => navigate(AppRoute.home)}>
          <ChevronLeftIcon />
        </BackButton>
        <div>
          <H2>{t('Enter_your_recovery_phrase')}</H2>
          <Body>{t('Enter_your_recovery_phrase_description')}</Body>
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
        <Button
          size="large"
          fullWith
          primary
          disabled={!isValid}
          loading={isLoading}
          onClick={() => onMnemonic(mnemonic)}
        >
          {t('Continue')}
        </Button>
      </Block>
    </>
  );
};
