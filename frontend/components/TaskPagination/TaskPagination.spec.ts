import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TaskPagination from './TaskPagination.vue';

describe('TaskPagination.vue', () => {
  it('рендерит кнопки и информацию о страницах', () => {
    const wrapper = mount(TaskPagination, {
      props: { currentPage: 2, totalPages: 5 }
    });
    expect(wrapper.text()).toContain('Страница 2 из 5');
    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].attributes('disabled')).toBeUndefined();
    expect(buttons[1].attributes('disabled')).toBeUndefined();
  });

  it('дизейблит кнопку Назад на 1 странице', () => {
    const wrapper = mount(TaskPagination, {
      props: { currentPage: 1, totalPages: 5 }
    });
    const backBtn = wrapper.findAll('button')[0];
    expect(backBtn.attributes('disabled')).toBeDefined();
  });

  it('дизейблит кнопку Вперед на последней странице', () => {
    const wrapper = mount(TaskPagination, {
      props: { currentPage: 5, totalPages: 5 }
    });
    const nextBtn = wrapper.findAll('button')[1];
    expect(nextBtn.attributes('disabled')).toBeDefined();
  });

  it('эмитит событие change', async () => {
    const wrapper = mount(TaskPagination, {
      props: { currentPage: 2, totalPages: 5 }
    });
    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click'); // Назад
    expect(wrapper.emitted('change')?.[0]).toEqual([1]);

    await buttons[1].trigger('click'); // Вперед
    expect(wrapper.emitted('change')?.[1]).toEqual([3]);
  });
});
