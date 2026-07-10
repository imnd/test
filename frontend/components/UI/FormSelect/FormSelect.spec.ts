import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FormSelect from './FormSelect.vue';

describe('FormSelect.vue', () => {
  it('рендерит label и slot', () => {
    const wrapper = mount(FormSelect, {
      props: { label: 'Статус' },
      slots: { default: '<option value="1">Опция 1</option>' }
    });
    expect(wrapper.find('label').text()).toBe('Статус');
    expect(wrapper.find('option').text()).toBe('Опция 1');
  });

  it('работает v-model', async () => {
    const wrapper = mount(FormSelect, {
      props: { modelValue: '1' },
      slots: { default: '<option value="1">Опция 1</option><option value="2">Опция 2</option>' }
    });
    const select = wrapper.find('select');
    expect((select.element as HTMLSelectElement).value).toBe('1');

    await select.setValue('2');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2']);
  });
});
