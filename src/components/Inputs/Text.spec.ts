import Text from './Text.vue'
import { render } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

const createWrapper = () => {
  return render(Text, {
    props: {
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
    const { emitted, findByDisplayValue } = createWrapper()
    const input = await findByDisplayValue('Kaut kāds teksts')
    const newText = 'Jauns teksts'

    const user = userEvent.setup()
    await user.click(input)
    await user.clear(input)
    await user.type(input, newText)

    const events = emitted('update:modelValue')

    expect(emitted()).toHaveProperty('update:modelValue')
    expect(events).toHaveLength(13)
    expect(events[0][0]).toBe('')
    expect(events[12][0]).toBe('Jauns teksts')
  })
})
