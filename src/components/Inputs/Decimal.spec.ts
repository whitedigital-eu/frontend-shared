import { mount } from '@vue/test-utils'
import Decimal from './Decimal.vue'

const createWrapper = (
  modelValue: string | number | null,
  placeholder = 'Test placeholder'
) => {
  return mount(Decimal, {
    propsData: { modelValue, label: placeholder },
  })
}

describe('Decimal', () => {
  test('renders label/placeholder', () => {
    const label = 'This is a label/placeholder'
    const wrapper = createWrapper('', 'This is a label/placeholder')
    expect(wrapper.text()).toContain(label)
  })
  it.each(['', null, 'asd', '#5*3[%'])(
    `if initial value is empty string, null or not parseable to number:
      (1) label/placeholder is placeholder;
      (2) label/placeholder transitions to label when input focused and back to placeholder when input blurred
      (3) displayed value is empty string;
      (4) nothing is emitted
  `,
    async (v) => {
      const wrapper = createWrapper(v)
      // (1), (2)
      expect(
        wrapper.findComponent({ name: 'FormFieldLabel' }).props().isPlaceholder
      ).toBeTruthy()
      await wrapper.find('input').trigger('focus')
      expect(
        wrapper.findComponent({ name: 'FormFieldLabel' }).props().isPlaceholder
      ).toBeFalsy()
      // (3)
      expect(wrapper.find('input').element.value).toBe('')
      // (4)
      expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')
    }
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
    `if initial value is a non-empty string parseable as number or number:
      (1) label/placeholder is label;
      (2) displayed value is a string representation of a number with "," as decimal separator
      (3) nothing is emitted
  `,
    async (modelValue, renderedValue) => {
      const wrapper = createWrapper(modelValue)
      // (1)
      expect(
        wrapper.findComponent({ name: 'FormFieldLabel' }).props().isPlaceholder
      ).toBeFalsy()
      // (2)
      expect(wrapper.find('input').element.value).toBe(renderedValue)
      // (3)
      expect(wrapper.emitted()).not.toHaveProperty('update:modelValue')
    }
  )

  // const createItem = (
  //   modelValue: string | number | null,
  //   keydownKey: string,
  //   renderedValue: string,
  //   emitValue: number,
  //   cursorPosition: number | null = null
  // ) => {
  //   return {
  //     modelValue,
  //     keydownKey,
  //     renderedValue,
  //     emitValue,
  //     cursorPosition,
  //   }
  // }

  // const setup = [createItem('2', '4', '24,00', 24)]
  // it.each(setup)('', async (x) => {
  //   const wrapper = createWrapper(x.modelValue)
  //
  //   wrapper.find('input').element.focus()
  //   wrapper.find('input').element.setSelectionRange(1, 1)
  //
  //   const e = new KeyboardEvent('keydown', {
  //     key: x.keydownKey,
  //   })
  //   // const spy = vi.spyOn(e, 'preventDefault')
  //   wrapper.find('input').element.dispatchEvent(e)
  //
  //   await wrapper.find('input').trigger('change')
  //
  //   // expect(spy).toHaveBeenCalledTimes(0)
  //   // expect(wrapper.find('input').element.value).toBe(x.renderedValue)
  //   expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  //   expect(wrapper.emitted()['update:modelValue']).toHaveLength(1)
  //   expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(x.emitValue)
  // })
  // test(`
  //   when typing (starting with empty input):
  //     (1) if a letter or symbol (including comma and dot) has been entered, displayed value does not change and nothing is emitted;
  //     (2) THEN if a number is entered, it is rendered and the new value is emitted
  //     (3) THEN if a comma is entered, it is rendered
  //     (4) THEN if numbers are entered until max decimal places reached, they are rendered and new value emitted
  //     (5) THEN if numbers are entered, they are ignored
  //     (6) THEN if the cursor is placed before the comma, and number is entered, it is displayed and new value emitted
  //     (7) THEN if some numbers are selected (including the comma in this case), and number is entered, selected numbers are deleted, it is displayed and new value emitted
  //     (8) THEN if dot is entered, comma is rendered
  // `, async () => {
  //   const wrapper = createWrapper()
  // })
})
