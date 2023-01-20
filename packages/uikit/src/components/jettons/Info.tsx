import React, { FC, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from '../../hooks/translation';
import { SkeletonImage, SkeletonText } from '../Sceleton';
import { Body2, H2 } from '../Text';

const Block = styled.div`
  display: flex;
  margin: 1rem 0 2.5rem;
  gap: 1rem;
  width: 100%;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Image = styled.img`
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 100%;
`;

interface CoinProps {
  amount?: string | number;
  symbol: string;
  price?: string;
  image?: string;
  description?: string;
}

export const CoinInfoSkeleton = () => {
  return (
    <Block>
      <Text>
        <H2>
          <SkeletonText size="large" />
        </H2>
        <SkeletonText />
        <SkeletonText width="80%" />
      </Text>
      <SkeletonImage width="60px" />
    </Block>
  );
};

const Body = styled(Body2)<{ open: boolean }>`
  color: ${(props) => props.theme.textSecondary};
  margin-bottom: 0.75rem;

  ${(props) =>
    !props.open &&
    css`
      max-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      position: relative;
    `}
`;

const Title = styled(H2)`
  margin-bottom: 2px;
`;

const Less = styled.div`
  cursor: pointer;
  margin-top: 4px;
  text-align: right;
  color: ${(props) => props.theme.textAccent};
`;

const More = styled.span`
  cursor: pointer;
  color: ${(props) => props.theme.textAccent};
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 2rem;
  background: linear-gradient(90deg, rgba(16, 22, 31, 0) 0%, #10161f 20%);
`;

const CroppedBodyText: FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (ref.current.scrollHeight === ref.current.clientHeight) {
        setOpen(true);
      }
    }
  }, [ref]);
  return (
    <Body ref={ref} onClick={() => setOpen(true)} open={open}>
      {text}
      {open ? undefined : <More>{t('More')}</More>}
    </Body>
  );
};

export const CoinInfo: FC<CoinProps> = ({
  amount,
  symbol,
  price,
  description,
  image,
}) => {
  return (
    <Block>
      <Text>
        <Title>
          {amount} {symbol}
        </Title>
        {price && <Body open>{price}</Body>}
        {description && <CroppedBodyText text={description} />}
      </Text>
      {image ? <Image src={image} /> : <SkeletonImage width="64px" />}
    </Block>
  );
};
