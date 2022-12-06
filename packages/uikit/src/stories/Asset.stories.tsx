import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Asset } from '../components/Asset';
import { defaultTheme } from '../styles/defaultTheme';

export default {
  title: 'Asset/Asset',
  component: Asset,
  argTypes: {
    symbol: { control: 'text' },
  },
} as ComponentMeta<typeof Asset>;

const Template: ComponentStory<typeof Asset> = (args) => (
  <ThemeProvider theme={defaultTheme}>
    <Asset {...args} />
  </ThemeProvider>
);

export const Primary = Template.bind({});
Primary.args = {
  symbol: 'TON',
};

export const Secondary = Template.bind({});
Secondary.args = {
  symbol: 'Jetton',
};
