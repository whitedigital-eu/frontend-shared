import Text from './Text.vue'
import { render, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

const createWrapper = (
  modelValue = '',
  label = 'Label text',
  readonly = false,
  long = false
) => {
  const { emitted, findByRole, queryByTestId } = render(Text, {
    props: {
      modelValue,
      label,
      readonly,
      long,
    },
  })

  const getInput = async () => (await findByRole('textbox')) as HTMLInputElement
  const getLabel = () => queryByTestId('form-field-label')
  const getUpdates = () => emitted('update:modelValue')

  return { getUpdates, getLabel, getInput }
}

describe('Text', () => {
  it('emits model value change event when text entered', async () => {
    const { getUpdates, getInput } = createWrapper('')
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
    const { getLabel } = createWrapper('', 'Label text')
    const { getByText } = within(await getLabel())
    expect(getByText('Label text')).toBeTruthy()
  })

  it('does not render label if not provided', async () => {
    const { getLabel } = createWrapper('', null)
    expect(await getLabel()).toBeNull()
  })

  test('input is readonly if readonly prop is true', async () => {
    const { getInput } = createWrapper('', '', true)
    expect((await getInput()).readOnly).toBe(true)
  })

  test('input is long if long prop is true', async () => {
    const { getInput } = createWrapper('', '', false, true)
    expect((await getInput()).classList.contains('sm:min-w-[432px]')).toBe(true)
  })

  test('input is not long if long prop is not true', async () => {
    const { getInput } = createWrapper('', '', false, false)
    expect((await getInput()).classList.contains('sm:min-w-[432px]')).toBe(
      false
    )
  })
})
