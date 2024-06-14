import { fireEvent, render } from '@testing-library/vue'
import Checkbox from '../Checkbox.vue'
import { CheckboxProps } from '../PropTypes'

const defaultProps: CheckboxProps = {
  modelValue: false,
  readonly: false,
  label: null,
}

const renderCheckbox = (props?: CheckboxProps) => {
  const { getByRole, emitted } = render(Checkbox, {
    props: { ...defaultProps, ...props },
  })

  const getCheckbox = () => getByRole('checkbox') as HTMLInputElement
  const getUpdates = () => emitted('update:modelValue')

  return { getCheckbox, getUpdates }
}

describe('Checkbox', () => {
  const modelValueTestCases: [boolean | undefined, boolean][] = [
    [undefined, false],
    [false, false],
    [true, true],
  ]
  it.each(modelValueTestCases)(
    'if modelValue prop is {modelValue}, then checkbox checked attribute is {isChecked}',
    async (modelValue, isChecked) => {
      const { getCheckbox } = renderCheckbox({ modelValue })
      expect(getCheckbox().checked).toBe(isChecked)
    },
  )
  it('toggles state (checked attribute) and updates model value when clicked', async () => {
    const { getCheckbox, getUpdates } = renderCheckbox()
    const checkbox = getCheckbox()

    await fireEvent.click(checkbox)

    const updates = getUpdates()
    expect(checkbox.checked).toBe(true)
    expect(updates.length).toBe(1)
    expect(updates[0][0]).toBe(true)

    await fireEvent.click(checkbox)

    expect(checkbox.checked).toBe(false)
    expect(updates.length).toBe(2)
    expect(updates[1][0]).toBe(false)
  })
})
