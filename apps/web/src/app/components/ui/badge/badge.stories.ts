import type { Meta, StoryObj } from '@storybook/angular';

import { Badge } from './badge';
import { background } from 'storybook/theming';

const meta: Meta<Badge> = {
  title: 'UI/Badge',
  component: Badge,

  tags: ['autodocs'],

  argTypes: {
    label: {
      description: 'Texto exibido dentro do badge.',
    },
    variant: {
      description: 'Define a intenção visual do badge.',
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'neutral'],
    },
  },

  parameters: {
    background: {
      options: { }
    }
  }


};

export default meta;

type Story = StoryObj<Badge>;

export const Neutral: Story = {
  args: {
    label: 'Membro',
    variant: 'neutral',
  },
};

export const Success: Story = {
  args: {
    label: 'Ativo',
    variant: 'success',
  },

};

export const Warning: Story = {
  args: {
    label: 'Pendente',
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    label: 'Recusado',
    variant: 'danger',
  },
};

export const Info: Story = {
  args: {
    label: 'Informação',
    variant: 'info',
  },
};

export const Playground: Story = {
  args: {
    label: 'Teste o Badge',
    variant: 'neutral',
  },
};
