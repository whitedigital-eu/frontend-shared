import Decimal from '../Decimal.vue'
import userEvent from '@testing-library/user-event'
import { fireEvent, render } from '@testing-library/vue'
import { DecimalProps } from '../PropTypes'

const defaultLabel = 'Test label'

const defaultProps: DecimalProps = {
  modelValue: '',
  label: defaultLabel,
  config: {},
}

const renderDecimal = (props?: DecimalProps) => {
  const { getByRole, queryByTestId, emitted } = render(Decimal, {
    props: { ...defaultProps, ...props },
  })

  const getInput = () => getByRole('textbox') as HTMLInputElement
  const getLabel = () => queryByTestId('form-field-label')
  const getUpdates = () => emitted('update:modelValue')

  return { getInput, getLabel, getUpdates }
}

describe('Decimal', () => {
  let user

  beforeAll(() => {
    user = userEvent.setup()
  })

  test('renders label/placeholder', () => {
    const { getLabel } = renderDecimal()
    const labelEl = getLabel()

    expect(labelEl.getAttribute('data-role')).toBe('placeholder')
    expect(labelEl.textContent).toBe(defaultLabel)
  })

  test('does not render placeholder if none provided', async () => {
    const { getLabel } = renderDecimal({ label: null })
    expect(getLabel()).toBeNull()
  })

  test.each(['', null, 'asd', '#5*3[%'])(
    `if initial value is empty string, null or not parseable to number:
      (1) label/placeholder is placeholder;
      (2) label/placeholder transitions to label when input focused and back to placeholder when input blurred
      (3) displayed value is empty string;
      (4) nothing is emitted
  `,
    async (modelValue) => {
      const { getLabel, getInput, getUpdates } = renderDecimal({ modelValue })
      // (1), (2)
      const labelEl = getLabel()
      const input = getInput()
      expect(labelEl.getAttribute('data-role')).toBe('placeholder')
      await user.click(input)
      expect(labelEl.getAttribute('data-role')).toBe('label')
      // (3)
      expect(input.value).toBe('')
      // (4)
      expect(getUpdates()).toBeUndefined()
    },
  )

  const truthyInputs: Array<[string | number, string]> = [
    ['5', '5,00'],
    ['712.4', '712,40'],
    ['9912,92', '9912,92'],
    ['123abc', '123,00'],
    [0, '0,00'],
    [77.32, '77,32'],
  ]
  it.each(truthyInputs)(
    `if initial value is a number or non-empty string parseable as number:
      (1) label/placeholder is label;
      (2) displayed value is a string representation of a number with "," as decimal separator
      (3) nothing is emitted
  `,
    async (modelValue, renderedValue) => {
      const label = 'Test label'
      const { getInput, getLabel, getUpdates } = renderDecimal({
        modelValue,
        label,
      })
      // (1)
      expect(getLabel().getAttribute('data-role')).toBe('label')
      // (2)
      expect(getInput().value).toBe(renderedValue)
      // (3)
      expect(getUpdates).toHaveLength(0)
    },
  )

  test(`
      when typing (starting with empty input):
        (1) if a letter or symbol (including comma and dot) has been entered, displayed value does not change and nothing is emitted;
        (2) THEN if a number is entered, it is rendered and the new value is emitted
        (3) THEN if a comma is entered, it is rendered
        (4) THEN if numbers are entered until max decimal places reached, they are rendered and new value emitted
        (5) THEN if numbers are entered, they are ignored
        (6) THEN if the cursor is placed before the comma, and number is entered, it is displayed and new value emitted
        (7) THEN if some numbers are selected (including the comma in this case), and number is entered, selected numbers are deleted, it is displayed and new value emitted
        (8) THEN if dot is entered, comma is rendered
    `, async () => {
    const { getInput, getUpdates } = renderDecimal()
    const input = getInput()
    await user.click(input)

    // (1)
    await user.type(input, '%')
    await user.type(input, 'a')
    await user.type(input, '[[')
    await user.type(input, ',')
    await user.type(input, '.')
    expect(input.value).toBe('')
    expect(getUpdates()).toBeUndefined()

    // (2)
    await user.type(input, '5')
    expect(input.value).toBe('5')
    expect(getUpdates()).toHaveLength(1)
    expect(getUpdates()[0][0]).toBe(5)

    //(3)
    await user.type(input, ',')
    expect(input.value).toBe('5,')
    expect(getUpdates()).toHaveLength(2)
    expect(getUpdates()[1][0]).toBe(5)

    //(4) and (5) - by default 2 decimal places allowed
    await user.type(input, '9')
    await user.type(input, '3')
    await user.type(input, '6')
    await user.type(input, '2')
    expect(input.value).toBe('5,93')
    expect(getUpdates()).toHaveLength(4)
    expect(getUpdates()[2][0]).toBe(5.9)
    expect(getUpdates()[3][0]).toBe(5.93)

    //(6)
    await userEvent.type(input, '2', {
      initialSelectionStart: 1,
      initialSelectionEnd: 1,
    })
    await userEvent.type(input, '6', {
      initialSelectionStart: 2,
      initialSelectionEnd: 2,
    })
    await expect(input.value).toBe('526,93')
    await expect(getUpdates()).toHaveLength(6)
    await expect(getUpdates()[4][0]).toBe(52.93)
    await expect(getUpdates()[5][0]).toBe(526.93)

    //(7)
    await userEvent.type(input, '8', {
      initialSelectionStart: 2,
      initialSelectionEnd: 4,
    })
    await expect(input.value).toBe('52893')
    await expect(getUpdates()).toHaveLength(7)
    await expect(getUpdates()[6][0]).toBe(52893)

    //(8)
    await userEvent.type(input, '.')
    await expect(input.value).toBe('52893,')
    await expect(getUpdates()).toHaveLength(7)
  })

  const maxDecimalTestCases: Array<
    [undefined | null | number, string, number]
  > = [
    [undefined, '1,23', 1.23],
    [null, '1,23456789', 1.23456789],
    [0, '123456789', 123456789], // if 0 decimal places allowed, when typing ",", it is ignored
    [1, '1,2', 1.2],
    [5, '1,23456', 1.23456],
  ]
  test.each(maxDecimalTestCases)(
    `when maxDecimals prop is {0} and "1,23456789" is typed into input,
      input value should be {1} and emitted value should be {2}`,
    async (maxDecimalsProp, inputValue, emittedValue) => {
      const valueToType = '1,23456789'
      const { getInput, getUpdates } = renderDecimal({
        config: { maxDecimals: maxDecimalsProp },
      })
      const input = getInput()
      await user.type(input, valueToType)
      expect(input.value).toBe(inputValue)
      const emittedUpdates = getUpdates()
      expect(emittedUpdates[emittedUpdates.length - 1][0]).toBe(emittedValue)
    },
  )

  const focusoutTestCases: Array<[string, string]> = [
    ['1', '1,00'],
    ['1,2', '1,20'],
  ]
  test.each(focusoutTestCases)(
    'when focusing out, if all decimal places are not entered, they are filled with zeros',
    async (valueToType, inputValue) => {
      const { getInput } = renderDecimal()
      const input = getInput()
      await user.type(input, valueToType)
      await fireEvent(input, new Event('blur'))
      expect(input.value).toBe(inputValue)
    },
  )

  test('underlying input is readonly if readonly prop is true', async () => {
    const { getInput } = renderDecimal({ config: { inputAttributes: { readonly: true } } })
    expect(getInput().readOnly).toBe(true)
  })
})
