import Text from './Text.vue'
import { render, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

// copied from Decimal.vue defineProps - important to keep in sync!!!
// move to separate file when importing props in vue files is supported
type Props = {
  modelValue?: string | number | null
  label?: string | null
  readonly?: boolean
  long?: boolean
}
const defaultProps: Props = {
  modelValue: '',
  label: 'Label text',
}

const renderText = (props?: Props) => {
  const { emitted, findByRole, queryByTestId } = render(Text, {
    props: { ...defaultProps, ...props },
  })

  const getInput = async () => (await findByRole('textbox')) as HTMLInputElement
  const getLabel = () => queryByTestId('form-field-label')
  const getUpdates = () => emitted('update:modelValue')

  return { getUpdates, getLabel, getInput }
}

describe('Text', () => {
  it('emits model value change event when text entered', async () => {
    const { getUpdates, getInput } = renderText()
    const input = await getInput()
    const newText = 'Jauns teksts'

    const user = userEvent.setup()
    await user.click(input)
    await user.type(input, newText)

    const updates = getUpdates()

    expect(updates).toHaveLength(12)
    expect(updates[11][0]).toBe('Jauns teksts')
  })

  it('renders label if provided', async () => {
    const { getLabel } = renderText()
    const { getByText } = within(await getLabel())
    expect(getByText('Label text')).toBeTruthy()
  })

  it('does not render label if not provided', async () => {
    const { getLabel } = renderText({ label: null })
    expect(await getLabel()).toBeNull()
  })

  test('input is readonly if readonly prop is true', async () => {
    const { getInput } = renderText({ readonly: true })
    expect((await getInput()).readOnly).toBe(true)
  })

  test('input is long if long prop is true', async () => {
    const { getInput } = renderText({ long: true })
    expect((await getInput()).classList.contains('sm:min-w-[416px]')).toBe(true)
  })

  test('input is not long if long prop is not true', async () => {
    const { getInput } = renderText({ long: false })
    expect((await getInput()).classList.contains('sm:min-w-[416px]')).toBe(
      false
    )
  })
})
