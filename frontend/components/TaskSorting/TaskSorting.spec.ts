import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TaskSorting from './TaskSorting.vue';

describe('TaskSorting.vue', () => {
  it('рендерит селект с правильным значением', () => {
    const wrapper = mount(TaskSorting, {
      props: {
        modelValue: 'due_date-asc'
      }
    });
    const select = wrapper.find('select');
    expect((select.element as HTMLSelectElement).value).toBe('due_date-asc');
  });

  it('эмитит update:modelValue и change при выборе', async () => {
    const wrapper = mount(TaskSorting, {
      props: { modelValue: 'created_at-desc' }
    });
    await wrapper.find('select').setValue('created_at-asc');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['created_at-asc']);
    expect(wrapper.emitted('change')).toBeTruthy();
  });
});
