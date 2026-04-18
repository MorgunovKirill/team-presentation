import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BasePagination from './base-pagination.vue'

describe('BasePagination', () => {
  it('does not render when total fits in one page', () => {
    const wrapper = mount(BasePagination, {
      props: { total: 10, pageSize: 12, modelValue: 1 },
    })
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('renders page numbers when multiple pages', () => {
    const wrapper = mount(BasePagination, {
      props: { total: 30, pageSize: 12, modelValue: 1 },
    })
    const pageButtons = wrapper.findAll('button[aria-current], button:not([aria-label])')
    const texts = pageButtons.map((b) => b.text())
    expect(texts).toContain('1')
    expect(texts).toContain('2')
    expect(texts).toContain('3')
  })

  it('marks current page with aria-current', () => {
    const wrapper = mount(BasePagination, {
      props: { total: 30, pageSize: 12, modelValue: 2 },
    })
    const current = wrapper.find('button[aria-current="page"]')
    expect(current.exists()).toBe(true)
    expect(current.text()).toBe('2')
  })

  it('emits update:modelValue when page clicked', async () => {
    const wrapper = mount(BasePagination, {
      props: { total: 30, pageSize: 12, modelValue: 1 },
    })
    const buttons = wrapper.findAll('button')
    const targetButton = buttons.find((b) => b.text() === '2')
    await targetButton?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('disables prev button on first page and next on last', () => {
    const first = mount(BasePagination, {
      props: { total: 30, pageSize: 12, modelValue: 1 },
    })
    expect(first.find('button[aria-label="Previous page"]').attributes('disabled')).toBeDefined()

    const last = mount(BasePagination, {
      props: { total: 30, pageSize: 12, modelValue: 3 },
    })
    expect(last.find('button[aria-label="Next page"]').attributes('disabled')).toBeDefined()
  })

  it('emits next/prev when arrow buttons clicked', async () => {
    const wrapper = mount(BasePagination, {
      props: { total: 30, pageSize: 12, modelValue: 2 },
    })
    await wrapper.find('button[aria-label="Next page"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    await wrapper.find('button[aria-label="Previous page"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([1])
  })

  it('does not emit when clicking current page', async () => {
    const wrapper = mount(BasePagination, {
      props: { total: 30, pageSize: 12, modelValue: 2 },
    })
    const buttons = wrapper.findAll('button')
    const currentBtn = buttons.find((b) => b.text() === '2')
    await currentBtn?.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
