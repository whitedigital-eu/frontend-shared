import { DOMWrapper, mount } from '@vue/test-utils'
import Checkbox from './Checkbox.vue'

const createWrapper = (modelValue: any = undefined) => {
  return mount(Checkbox, {
    propsData: { modelValue },
  })
}

describe('Checkbox', () => {
  it('is not checked, if no model value is set', async () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[type=checkbox]:checked').exists()).toBeFalsy()
  })
  it('is not checked, if initial model value is FALSE', async () => {
    const wrapper = createWrapper(false)
    expect(wrapper.find('input[type=checkbox]:checked').exists()).toBeFalsy()
  })
  it('is checked, if initial model value is TRUE', async () => {
    const wrapper = createWrapper(true)
    expect(wrapper.find('input[type=checkbox]:checked').exists()).toBeTruthy()
  })
  it('toggles state (checked attribute) and updates model value when clicked', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type=checkbox]')

    await wrapper.setProps({ modelValue: true })
    await input.trigger('change')

    expect(wrapper.find('input[type=checkbox]:checked').exists()).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'].length).toBe(1)
    expect((wrapper.emitted('update:modelValue') as any[])[0][0]).toBe(true)

    await wrapper.setProps({ modelValue: false })
    await input.trigger('change', { value: true })

    expect(wrapper.find('input[type=checkbox]:checked').exists()).toBeFalsy()
    expect(wrapper.emitted()['update:modelValue'].length).toBe(2)
    expect((wrapper.emitted('update:modelValue') as any[])[1][0]).toBe(false)
  })
})
