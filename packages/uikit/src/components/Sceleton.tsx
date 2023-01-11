import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { ColumnText } from './Layout';
import { ListBlock, ListItem, ListItemPayload } from './List';
import { SubHeader } from './SubHeader';

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomWidth() {
  return randomIntFromInterval(30, 90) + '%';
}

const Base = styled.div`
  display: inline-block;

  @keyframes placeHolderShimmer {
    0% {
      background-position: -800px 0;
    }
    100% {
      background-position: 800px 0;
    }
  }

  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background-color: #f6f7f8;
  background: linear-gradient(to right, #eeeeee 8%, #bbbbbb 18%, #eeeeee 33%);
  background-size: 800px 104px;

  opacity: 0.1;

  position: relative;
`;
const Block = styled(Base)<{ size?: string; width?: string }>`
  border-radius: ${(props) => props.theme.cornerExtraExtraSmall};

  ${(props) => css`
    width: ${props.width ?? randomWidth()};
  `}

  ${(props) => {
    switch (props.size) {
      case 'large':
        return css`
          height: 1.5rem;
        `;
      case 'small':
        return css`
          height: 0.5rem;
        `;
      default:
        return css`
          height: 1rem;
        `;
    }
  }}
`;

export const SkeletonText: FC<{ size?: 'large' | 'small'; width?: string }> =
  React.memo(({ size, width }) => {
    return <Block size={size} width={width} />;
  });

const Image = styled(Base)<{ width?: string }>`
  border-radius: ${(props) => props.theme.cornerFull};

  ${(props) => css`
    width: ${props.width ?? '44px'};
    height: ${props.width ?? '44px'};
  `}
`;

export const SkeletonImage: FC<{ width?: string }> = React.memo(({ width }) => {
  return <Image width={width} />;
});

export const SkeletonSubHeader = React.memo(() => {
  return <SubHeader title={<SkeletonText size="large" />} />;
});

const ActionBlock = styled.div`
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const SkeletonAction = React.memo(() => {
  return (
    <ActionBlock>
      <SkeletonImage />
      <SkeletonText size="small" width="50px" />
    </ActionBlock>
  );
});

const ListItemBlock = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

export const SkeletonList: FC<{ size?: number }> = React.memo(
  ({ size = 1 }) => {
    return (
      <ListBlock>
        {Array(size)
          .fill(null)
          .map((item, index) => (
            <ListItem key={index} hover={false}>
              <ListItemPayload>
                <ListItemBlock>
                  <SkeletonImage />
                  <ColumnText
                    text={
                      <SkeletonText
                        width={randomIntFromInterval(30, 300) + 'px'}
                      />
                    }
                    secondary={<SkeletonText size="small" width="40px" />}
                  ></ColumnText>
                </ListItemBlock>
              </ListItemPayload>
            </ListItem>
          ))}
      </ListBlock>
    );
  }
);
