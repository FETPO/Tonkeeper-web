import React, { FC, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { Button } from '../Button';
import { ChevronLeftIcon } from '../Icon';
import { Body1, Body2, H2 } from '../Text';

const BackButton = styled.div`
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: ${(props) => props.theme.cornerFull};
  color: ${(props) => props.theme.textPrimary};
  background: ${(props) => props.theme.backgroundContent};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.backgroundContentTint};
  }
`;

const Block = styled.div`
  display: flex;
  text-align: center;
  gap: 1rem;
  flex-direction: column;
`;

const Body = styled(Body2)`
  text-align: center;
  color: ${(props) => props.theme.textSecondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(12, minmax(0, 1fr));
  grid-auto-flow: column;
  gap: 0.5rem;
  place-content: space-around;
`;

const World = styled(Body1)``;

const Number = styled.span`
  display: inline-block;
  width: 30px;
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
        <H2>{t('Your_recovery_phrase')}</H2>
        <Body>{t('Your_recovery_phrase_description')}</Body>
      </Block>

      <Grid>
        {mnemonic.map((world, index) => (
          <World key={index}>
            <Number> {index + 1}.</Number> {world}{' '}
          </World>
        ))}
      </Grid>

      <Button size="large" fullWith primary bottom onClick={onCheck}>
        {t('Continue')}
      </Button>
    </>
  );
};

const InputBlock = styled.label<{ active: boolean; valid: boolean }>`
  width: 100%;
  line-height: 56px;
  border-radius: ${(props) => props.theme.cornerSmall};
  display: flex;
  padding: 0 1rem;
  gap: 0.5rem;
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
`;

const Input = styled.input`
  outline: none;
  border: none;
  background: transparent;
  flex-grow: 1;
  font-weight: 500;
  font-size: 16px;

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
      <Number>{test}.</Number>
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
}> = ({ onBack, onConfirm, mnemonic }) => {
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
        <H2>{t('So_let_s_check')}</H2>
        <Body>{description}</Body>
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
        bottom
        disabled={!isValid}
        onClick={onConfirm}
      >
        {t('Continue')}
      </Button>
    </>
  );
};
