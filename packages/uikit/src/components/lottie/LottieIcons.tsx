import React, { FC } from 'react';
import Lottie from 'react-lottie';
import * as animationCheckData from './Check.json';
import * as animationGearData from './Gear.json';
import * as animationTonkeeperLogoData from './TonkeeperLogo.json';
import * as animationWriteData from './Write.json';

const defaultCheckOptions = {
  loop: false,
  autoplay: true,
  animationData: animationCheckData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export const CheckLottieIcon = () => {
  return <Lottie options={defaultCheckOptions} height={160} width={160} />;
};

const defaultGearOptions = {
  loop: false,
  autoplay: true,
  animationData: animationGearData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export const GearLottieIcon = () => {
  return <Lottie options={defaultGearOptions} height={160} width={160} />;
};

const defaultWriteOptions = {
  loop: false,
  autoplay: true,
  animationData: animationWriteData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export const WriteLottieIcon = () => {
  return <Lottie options={defaultWriteOptions} height={160} width={160} />;
};

const defaultTonkeeperLogoOptions = {
  autoplay: true,
  animationData: animationTonkeeperLogoData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export const TonkeeperLogoLottieIcon: FC<{
  width: string;
  height: string;
  loop: boolean;
}> = ({ width, height, loop }) => {
  return (
    <Lottie
      options={{ ...defaultTonkeeperLogoOptions, loop }}
      height={parseInt(height)}
      width={parseInt(width)}
    />
  );
};
