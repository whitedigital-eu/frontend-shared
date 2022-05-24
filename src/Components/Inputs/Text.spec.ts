import { mount } from '@vue/test-utils'
import Text from './Text.vue'

const createWrapper = () => {
  return mount(Text, {
    propsData: {
      input: {
        name: 'test-input',
        label: 'test-label',
      },
      modelValue: 'Kaut kāds teksts',
    },
  })
}

describe('Text', () => {
  it('emits model value change event when text entered', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    const newText = 'Jauns teksts'
    await input.setValue(newText)
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect((wrapper.emitted('update:modelValue') as any[])[0][0]).toBe(newText)
  })
})
