import { mount } from '@vue/test-utils'
import Slider from './Slider.vue'

const createWrapper = (modelValue: any = undefined) => {
  return mount(Slider, {
    propsData: { modelValue },
  })
}

describe('Slider', () => {
  it('has default value 0, if no model value given', async () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.vue-slider-dot-tooltip-text').text()).toBe('0')
  })
  it('renders model value, if given', async () => {
    const initialValue = 40
    const wrapper = createWrapper(initialValue)

    expect(wrapper.find('.vue-slider-dot-tooltip-text').text()).toBe(
      initialValue.toString()
    )
  })
  it('emits update event, when model value changes', async () => {
    const wrapper = createWrapper()

    await wrapper.setValue(80)

    expect((wrapper.emitted()['update:modelValue'] as any[])[0][0]).toBe(80)
  })
})
