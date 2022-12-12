<template>
  <div class="relative" :class="{ 'overflow-hidden': labelIsPlaceholder }">
    <FormFieldLabel
      v-if="label"
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
      :readonly="readonly"
      @keydown="handleKeydown"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'
import { DecimalValue } from './ValueTypes'

type Props = {
  modelValue: DecimalValue
  label?: string | null
  readonly?: boolean
  maxDecimals?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: null,
  readonly: false,
  maxDecimals: 2,
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

const emitUpdate = (value: string) => {
  const valueToEmit = value.length ? parseFloat(value.replace(',', '.')) : null
  emit('update:modelValue', valueToEmit)
}

const transformValue = (value: string): string => {
  let transformedValue = value
  if (!value) return value

  transformedValue = transformedValue.replace('.', decSeparator)
  if (!transformedValue.includes(decSeparator)) {
    return props.maxDecimals! === 0
      ? transformedValue
      : `${transformedValue},${'0'.repeat(props.maxDecimals!)}`
  }

  const decimal = transformedValue.split(decSeparator)[1]

  transformedValue =
    decimal.length > props.maxDecimals!
      ? transformedValue.slice(0, props.maxDecimals! - decimal.length)
      : transformedValue.padEnd(
          transformedValue.length + (props.maxDecimals! - decimal.length),
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

const valuePropToValue = (n: Props['modelValue']) => {
  let stringVal = ''
  if (typeof n === 'number') stringVal = n.toString()
  if (typeof n === 'string') {
    if (n.indexOf(',') !== -1 && !isNaN(parseFloat(n.replace(',', '.')))) {
      stringVal = parseFloat(n.replace(',', '.')).toString()
    } else if (!isNaN(parseFloat(n))) {
      stringVal = parseFloat(n).toString()
    }
  }

  return transformValue(stringVal)
}

const inputRef = ref<HTMLInputElement | undefined>()
const value = ref(valuePropToValue(props.modelValue))
const hasFocus = ref(false)
const isEmpty = computed(() => !value.value)
const labelIsPlaceholder = computed<boolean>(
  () => props.label !== null && isEmpty.value && !hasFocus.value
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

const handleKeydown = (e: KeyboardEvent) => {
  if (allowedKeys.includes(e.code)) return
  if (!e.target || !(e.target instanceof HTMLInputElement)) return

  const valueSplitByDecSeparator = e.target.value.split(decSeparator)
  const hasDecSeparator = valueSplitByDecSeparator.length === 2
  const allowToEnterDecSeparator =
    !hasDecSeparator && e.target.value.length && props.maxDecimals !== 0

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
    props.maxDecimals !== undefined &&
    hasDecSeparator &&
    valueSplitByDecSeparator[1].length === props.maxDecimals

  if (!textSelected && !caretBeforeDecSeparator && tooManyDecimals) {
    e.preventDefault()
  }
}

const handleInput = (e: Event) => {
  const targetValue: string = (e.target as HTMLInputElement).value
  emitUpdate(targetValue)
}

const handleLabelClick = () => {
  inputRef.value?.focus()
}

watch(
  () => props.modelValue,
  (n) => {
    const newValue = valuePropToValue(n)
    if (newValue === valuePropToValue(value.value)) return

    value.value = newValue
  }
)
</script>

<style lang="scss" scoped>
input {
  display: block;
  appearance: none;
  transition: all 0.2s ease-in-out;
}
</style>
