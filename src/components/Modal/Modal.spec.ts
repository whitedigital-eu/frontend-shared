import { mount } from '@vue/test-utils'
import Modal from './Modal.vue'
import { h } from 'vue'
import { vi } from 'vitest'

// Mock helper-js isMobile function
vi.mock('helper-js', () => ({
  isMobile: () => false
}))

// Mock Teleport component
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  const h = actual.h

  return {
    ...actual,
    Teleport: (props, { slots }) => {
      // Use a functional component that returns the slot content
      return slots.default ? h('div', slots.default()) : null
    }
  }
})

vi.mock('@left4code/tw-starter/dist/js/dom', () => vi.fn())

describe('Modal', () => {
  it('renders modal with header, body and footer', () => {
    const wrapper = mount(Modal)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.modal-header').exists()).toBe(true)
    expect(wrapper.find('.modal-body').exists()).toBe(true)
    expect(wrapper.find('.modal-footer').exists()).toBe(true)
  })

  it('changes size if passed size prop', () => {
    const wrapper = mount(Modal, { propsData: { size: 'xl' } })

    expect(wrapper.find('.modal-dialog').classes()).toContain('modal-xl')
  })

  it('emits close event', async () => {
    const wrapper = mount(Modal)

    wrapper.find('a').trigger('click')

    await new Promise((r) => setTimeout(r, 400))

    expect(wrapper.emitted()).toHaveProperty('close')
    expect(wrapper.emitted()['close']).toHaveLength(1)
  })
})
