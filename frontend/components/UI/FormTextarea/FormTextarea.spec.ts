import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FormTextarea from './FormTextarea.vue';

describe('FormTextarea.vue', () => {
  it('рендерит label', () => {
    const wrapper = mount(FormTextarea, {
      props: { label: 'Описание' }
    });
    expect(wrapper.find('label').text()).toBe('Описание');
  });

  it('работает v-model', async () => {
    const wrapper = mount(FormTextarea, {
      props: { modelValue: 'test text' }
    });
    const textarea = wrapper.find('textarea');
    expect((textarea.element as HTMLTextAreaElement).value).toBe('test text');

    await textarea.setValue('new text');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new text']);
  });
});
