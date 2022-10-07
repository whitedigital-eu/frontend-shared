<template>
  <div class="relative" :class="{ 'overflow-hidden': labelIsPlaceholder }">
    <FormFieldLabel
      :is-placeholder="labelIsPlaceholder"
      @click.native="handleLabelClick"
    >
      {{ props.label }}
    </FormFieldLabel>
    <input
      ref="inputRef"
      v-model="value"
      type="text"
      inputmode="decimal"
      class="form-control w-full sm:min-w-[200px]"
      :class="{ 'sm:min-w-[432px]': long }"
      :readonly="readonly"
      @keydown="handleKeydown"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref, watch } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number] as PropType<string | number | null>,
    required: false,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
  long: {
    type: Boolean,
    required: false,
    default: false,
  },
  maxDecimals: {
    type: Number as PropType<number | null>,
    required: false,
    default: 2,
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const decSeparator = ','

const inputTextSelected = (el: HTMLInputElement): boolean => {
  return el.selectionStart !== el.selectionEnd
}
const isCaretBeforeDecSeparator = (el: HTMLInputElement) => {
  const caretPos =
    el.selectionDirection == 'backward' ? el.selectionStart : el.selectionEnd
  if (caretPos === null) return false

  const indexOfDecSeparator = el.value.indexOf(decSeparator)
  return indexOfDecSeparator > -1 && caretPos <= indexOfDecSeparator
}

const justEmitted = ref(false)

const emitUpdate = (value) => {
  justEmitted.value = true
  const valueToEmit = value.length ? parseFloat(value.replace(',', '.')) : null
  emit('update:modelValue', valueToEmit)
}

const transformValue = (value: string): string => {
  let transformedValue = value
  if (!value) return value

  transformedValue = transformedValue.replace('.', decSeparator)
  if (!transformedValue.includes(decSeparator)) return `${transformedValue},00`

  const decimal = transformedValue.split(decSeparator)[1]

  transformedValue =
    decimal.length > 2
      ? transformedValue.slice(0, 2 - decimal.length)
      : transformedValue.padEnd(
          transformedValue.length + (2 - decimal.length),
          '0'
        )

  return transformedValue
}

const handleFocus = () => (hasFocus.value = true)
const handleBlur = () => {
  hasFocus.value = false
  value.value = transformValue(value.value)
  emitUpdate(value.value)
}

const inputRef = ref<HTMLInputElement | undefined>()
const value = ref('')
const hasFocus = ref(false)
const isEmpty = computed(() => !value.value)
const labelIsPlaceholder = computed<boolean>(
  () => isEmpty.value && !hasFocus.value
)

const allowedKeys = [
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Tab',
  'Enter',
]

const handleKeydown = (e) => {
  if (allowedKeys.includes(e.code)) return

  const valueSplitByDecSeparator = e.target.value.split(decSeparator)
  const hasDecSeparator = valueSplitByDecSeparator.length === 2
  const allowToEnterDecSeparator = !hasDecSeparator && e.target.value.length

  const invalidCharacter =
    (isNaN(Number(e.key)) &&
      !(e.key === decSeparator && allowToEnterDecSeparator)) ||
    e.code === 'Space'
  if (invalidCharacter) {
    e.preventDefault()
    if (e.key === '.' && allowToEnterDecSeparator) {
      value.value += decSeparator
    }
    return
  }

  const textSelected = inputTextSelected(e.target)
  const caretBeforeDecSeparator = isCaretBeforeDecSeparator(e.target)

  const tooManyDecimals =
    props.maxDecimals &&
    hasDecSeparator &&
    valueSplitByDecSeparator[1].length === props.maxDecimals

  if (!textSelected && !caretBeforeDecSeparator && tooManyDecimals) {
    e.preventDefault()
  }
}

const handleInput = (e: InputEvent) => {
  const targetValue: string = (e.target as HTMLInputElement).value
  emitUpdate(targetValue)
}

const handleLabelClick = () => {
  inputRef.value?.focus()
}

watch(
  () => props.modelValue,
  (n) => {
    if (justEmitted.value) {
      justEmitted.value = false
      return
    }

    let stringVal = ''
    if (typeof n === 'number') stringVal = n.toString()
    if (typeof n === 'string') {
      if (n.indexOf(',') !== -1 && !isNaN(parseFloat(n.replace(',', '.')))) {
        stringVal = parseFloat(n.replace(',', '.')).toString()
      } else if (!isNaN(parseFloat(n))) {
        stringVal = parseFloat(n).toString()
      }
    }

    value.value = transformValue(stringVal)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
input {
  display: block;
  appearance: none;
  transition: all 0.2s ease-in-out;
}
</style>
