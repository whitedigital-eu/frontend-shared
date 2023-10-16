import Slider from '../Slider.vue'
import { fireEvent, render } from '@testing-library/vue'
import { SliderProps } from '../PropTypes'

const renderSlider = (props?: SliderProps) => {
  const { container, emitted, getByText } = render(Slider, { props })

  const getSliderDot = () => container.querySelector('.vue-slider-dot')
  const getSliderDotTooltip = () =>
    getSliderDot().querySelector('.vue-slider-dot-tooltip-text')
  const getSliderMark = (index: 0 | 1 | 2 | 3 | 4) =>
    container.querySelectorAll('.vue-slider-mark')[index] as HTMLDivElement
  const getUpdates = () => emitted('update:modelValue')

  return {
    getSliderDot,
    getSliderDotTooltip,
    getSliderMark,
    getUpdates,
    getByText,
  }
}

describe('Slider', () => {
  const modelValueTestCases: [number | undefined, string, number][] = [
    [undefined, '0', 0],
    [0, '0', 0],
    [40, '40', 40],
    [71.2512, '71.2512', 71.2512],
  ]
  test.each(modelValueTestCases)(
    'if modelValue prop (v-model) is {modelValue}, slider value is {sliderValue}',
    async (modelValue, sliderValue, sliderDotProgress) => {
      const { getSliderDot, getSliderDotTooltip, getUpdates } = renderSlider({
        modelValue,
      })

      expect(getSliderDot().getAttribute('style')).toContain(
        `left: ${sliderDotProgress}%`,
      )
      expect(getSliderDotTooltip().textContent).toBe(sliderValue)
      expect(getUpdates()).toBeUndefined()
    },
  )

  it.each([20, 40, 60, 80, 100])(
    'when clicking on slider values, slider value changes and update event is emitted',
    async (valueToClick) => {
      const { getSliderDot, getSliderDotTooltip, getByText, getUpdates } =
        renderSlider()

      await fireEvent.click(getByText(valueToClick.toString()))
      expect(getSliderDot().getAttribute('style')).toContain(
        `left: ${valueToClick}%`,
      )
      expect(getSliderDotTooltip().textContent).toBe(valueToClick.toString())
      expect(getUpdates().length).toBe(1)
      expect(getUpdates()[0][0]).toBe(valueToClick)
    },
  )
})
