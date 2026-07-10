import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TaskCard from './TaskCard.vue'

import type { Task } from '~/types'

describe('TaskCard.vue', () => {
  const dummyTask: Task = {
    id: 1,
    title: 'Тестовая задача',
    description: 'Описание тестовой задачи',
    status: 'pending',
    due_date: '2026-08-01T00:00:00.000000Z',
    user_id: 1,
    created_at: '2026-07-10T10:00:00.000000Z',
    updated_at: '2026-07-10T10:00:00.000000Z'
  }

  it('отображает переданные данные задачи', () => {
    const wrapper = mount(TaskCard, {
      props: {
        task: dummyTask,
        canEdit: false
      }
    })

    expect(wrapper.text()).toContain('Тестовая задача')
    expect(wrapper.text()).toContain('Описание тестовой задачи')
    // Статус 'pending' должен мапиться в 'Ожидает'
    expect(wrapper.text()).toContain('Ожидает')
    expect(wrapper.text()).toContain('Дедлайн: 01.08.2026')
  })

  it('не показывает кнопки действий, если canEdit = false', () => {
    const wrapper = mount(TaskCard, {
      props: {
        task: dummyTask,
        canEdit: false
      }
    })

    // Блок task-card__actions имеет v-if="canEdit"
    const actionsBlock = wrapper.find('.task-card__actions')
    expect(actionsBlock.exists()).toBe(false)
  })

  it('показывает кнопки действий, если canEdit = true', () => {
    const wrapper = mount(TaskCard, {
      props: {
        task: dummyTask,
        canEdit: true
      }
    })

    const actionsBlock = wrapper.find('.task-card__actions')
    expect(actionsBlock.exists()).toBe(true)

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].text()).toBe('Ред.')
    expect(buttons[1].text()).toBe('Удал.')
  })

  it('эмитит события edit и delete при клике на кнопки', async () => {
    const wrapper = mount(TaskCard, {
      props: {
        task: dummyTask,
        canEdit: true
      }
    })

    const buttons = wrapper.findAll('button')
    
    // Клик по кнопке "Ред."
    await buttons[0].trigger('click')
    expect(wrapper.emitted()).toHaveProperty('edit')

    // Клик по кнопке "Удал."
    await buttons[1].trigger('click')
    expect(wrapper.emitted()).toHaveProperty('delete')
  })
})
