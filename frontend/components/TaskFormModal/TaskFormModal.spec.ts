import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TaskFormModal from './TaskFormModal.vue';

// Mock components that are auto-imported
const FormInput = { template: '<input type="text" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />', props: ['modelValue'] };
const FormTextarea = { template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>', props: ['modelValue'] };
const FormSelect = { template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><slot></slot></select>', props: ['modelValue'] };

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    fetch: vi.fn().mockResolvedValue({})
  })
}));

describe('TaskFormModal.vue', () => {
  it('рендерит форму создания задачи', () => {
    const wrapper = mount(TaskFormModal, {
      global: { components: { FormInput, FormTextarea, FormSelect } }
    });
    expect(wrapper.text()).toContain('Новая задача');
    expect(wrapper.text()).toContain('Сохранить');
  });

  it('рендерит форму редактирования задачи', async () => {
    const wrapper = mount(TaskFormModal, {
      props: {
        task: {
          id: 1, title: 'Тест', description: '', status: 'pending', user_id: 1, due_date: null, created_at: '', updated_at: ''
        }
      },
      global: { components: { FormInput, FormTextarea, FormSelect } }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Редактировать задачу');
    const input = wrapper.find('input[type="text"]');
    expect((input.element as HTMLInputElement).value).toBe('Тест');
  });

  it('эмитит close при клике на отмену', async () => {
    const wrapper = mount(TaskFormModal, {
      global: { components: { FormInput, FormTextarea, FormSelect } }
    });
    await wrapper.find('.btn-outline').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });
});
