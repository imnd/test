import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FormInput from './FormInput.vue';

describe('FormInput.vue', () => {
  it('рендерит label', () => {
    const wrapper = mount(FormInput, {
      props: { label: 'Имя' }
    });
    expect(wrapper.find('label').text()).toBe('Имя');
  });

  it('работает v-model', async () => {
    const wrapper = mount(FormInput, {
      props: { modelValue: 'test' }
    });
    const input = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('test');

    await input.setValue('new value');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value']);
  });

  it('показывает ошибку', () => {
    const wrapper = mount(FormInput, {
      props: { error: 'Поле обязательно' }
    });
    expect(wrapper.find('.error-text').text()).toBe('Поле обязательно');
  });
});
