import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TaskFilters from './TaskFilters.vue';

describe('TaskFilters.vue', () => {
  it('рендерит инпуты с правильными значениями', () => {
    const wrapper = mount(TaskFilters, {
      props: {
        search: 'тест',
        status: 'pending'
      }
    });
    const searchInput = wrapper.find('input[type="text"]');
    expect((searchInput.element as HTMLInputElement).value).toBe('тест');
    const statusSelect = wrapper.find('select');
    expect((statusSelect.element as HTMLSelectElement).value).toBe('pending');
  });

  it('эмитит update:search при вводе текста', async () => {
    const wrapper = mount(TaskFilters, {
      props: { search: '', status: '' }
    });
    await wrapper.find('input[type="text"]').setValue('новое');
    expect(wrapper.emitted('update:search')?.[0]).toEqual(['новое']);
    expect(wrapper.emitted('search-input')).toBeTruthy();
  });

  it('эмитит update:status при выборе', async () => {
    const wrapper = mount(TaskFilters, {
      props: { search: '', status: '' }
    });
    await wrapper.find('select').setValue('completed');
    expect(wrapper.emitted('update:status')?.[0]).toEqual(['completed']);
    expect(wrapper.emitted('status-change')).toBeTruthy();
  });
});
