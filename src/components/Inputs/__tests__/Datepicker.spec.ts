import Datepicker from '../Datepicker.vue'
import { fireEvent, render } from '@testing-library/vue'
import { vi } from 'vitest'
import { DatepickerProps } from '../PropTypes'

vi.mock('../../composables/useResponsivity', () => ({ default: () => false }))

const renderDatepicker = (props?: DatepickerProps) => {
  const { queryByTestId, getByRole, emitted, container } = render(Datepicker, {
    props,
  })

  const getInput = () => getByRole('textbox') as HTMLInputElement
  const getLabel = () => queryByTestId('form-field-label')
  const getUpdates = () => emitted('update:modelValue')
  const getCalendarDayContainer = () =>
    container.querySelector('.flatpickr-calendar.open .dayContainer')
  const getCloseButton = () => getByRole('button') as HTMLButtonElement

  return {
    getInput,
    getLabel,
    getUpdates,
    getCalendarDayContainer,
    getCloseButton,
  }
}

describe('Datepicker', () => {
  const modelValueTestCases: [DatepickerProps['modelValue'], string][] = [
    [undefined, ''],
    [null, ''],
    ['Test', ''],
    ['2022-10-11T13:34:38.041Z', 'October 11, 2022'],
  ]
  test.each(modelValueTestCases)(
    'if modelValue prop (v-model) is {0}, then rendered value is {1}. also, if {1} is truthy, label should be label, else - placeholder',
    async (modelValue, renderedValue) => {
      const { getInput, getLabel } = renderDatepicker({
        modelValue,
        label: 'Test label',
      })

      const labelEl = getLabel()

      expect(labelEl.getAttribute('data-role')).toBe(
        renderedValue ? 'label' : 'placeholder',
      )

      expect((await getInput()).value).toBe(renderedValue)
    },
  )

  const labelTestCases: Array<
    [DatepickerProps['label'], string] | [DatepickerProps['label']]
  > = [[undefined], [null], [''], ['Test label', 'Test label']]
  test.each(labelTestCases)(
    'if label prop ir {0}, label is rendered if {0} is truthy, and rendered label value is {1}',
    async (label, renderedLabel) => {
      const { getLabel } = renderDatepicker({ label })

      const labelEl = await getLabel()
      if (!label) expect(labelEl).toBeNull()
      else expect(labelEl.textContent).toBe(renderedLabel)
    },
  )

  test('when clicking on input or placeholder, datepicker opens, and when clicking on date, it closes and date is emitted', async () => {
    const { getInput, getLabel, getUpdates, getCalendarDayContainer } =
      renderDatepicker({
        label: 'Test label',
      })
    const label = getLabel()
    const input = getInput()

    expect(await getCalendarDayContainer()).toBeNull()

    //click on label - calendar opens
    await fireEvent.click(label)
    expect(await getCalendarDayContainer()).not.toBeNull()

    //click on day - calendar closes and date is emitted
    await fireEvent.click(
      await getCalendarDayContainer().querySelector('.flatpickr-day'),
    )
    expect(await getCalendarDayContainer()).toBeNull()
    expect(getUpdates()).toHaveLength(1)
    // should check value here, but due to datepicker being coupled to current date, not possible.

    //click on input - calendar opens
    await fireEvent.click(input)
    expect(await getCalendarDayContainer()).not.toBeNull()

    //click on day - calendar closes and date is emitted
    await fireEvent.click(
      await getCalendarDayContainer().querySelector('.flatpickr-day'),
    )
    expect(await getCalendarDayContainer()).toBeNull()
    expect(getUpdates()).toHaveLength(2)
    // should check value here, but due to datepicker being coupled to current date, not possible.
  })

  test.only('datepicker can be closed via button under datepicker', async () => {
    const { getInput, getCloseButton, getCalendarDayContainer } =
      renderDatepicker()
    await fireEvent.click(await getInput())
    expect(await getCalendarDayContainer()).not.toBeNull()
    await fireEvent.click(await getCloseButton())
    expect(await getCalendarDayContainer()).toBeNull()
  })
})
