import { fireEvent, render } from '@testing-library/vue'
import Checkbox from './Checkbox.vue'

// copied from Checkbox.vue defineProps - important to keep in sync!!!
// move to separate file when importing props in vue files is supported
type Props = {
  modelValue?: boolean
  readonly?: boolean
  label?: string | null
}
const defaultProps: Props = {
  modelValue: false,
  readonly: false,
  label: null,
}

const renderCheckbox = (props?: Props) => {
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
    }
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
