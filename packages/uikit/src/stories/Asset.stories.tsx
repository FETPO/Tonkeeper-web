import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Asset } from '../components/Asset';

export default {
  title: 'Asset/Asset',
  component: Asset,
  argTypes: {
    symbol: { control: 'text' },
  },
} as ComponentMeta<typeof Asset>;

const Template: ComponentStory<typeof Asset> = (args) => <Asset {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  symbol: 'TON',
};

export const Secondary = Template.bind({});
Secondary.args = {
  symbol: 'Jetton',
};
