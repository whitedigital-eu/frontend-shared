import Text from '../Text.vue'
import { render, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { TextProps } from '../PropTypes'

const defaultProps: TextProps = {
  modelValue: '',
  label: 'Label text',
}

const renderText = (props?: TextProps) => {
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
    const { getByText } = within(getLabel())
    expect(getByText('Label text')).toBeTruthy()
  })

  it('does not render label if not provided', async () => {
    const { getLabel } = renderText({ label: null })
    expect(getLabel()).toBeNull()
  })

  test('input is readonly if readonly prop is true', async () => {
    const { getInput } = renderText({ config: { readonly: true } })
    expect((await getInput()).readOnly).toBe(true)
  })

  test('input attributes get applied to input element', async () => {
    const { getInput } = renderText({
      config: { inputAttributes: { class: 'test-class' } },
    })
    expect((await getInput()).classList.contains('test-class')).toBe(true)
  })
})
