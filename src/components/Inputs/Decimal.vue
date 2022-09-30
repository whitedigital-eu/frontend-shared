<template>
  <div class="relative" :class="{ 'overflow-hidden': isEmpty && !hasFocus }">
    <FormFieldLabel
      :is-placeholder="isEmpty && !hasFocus"
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
    type: [String, Number] as PropType<string | number>,
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
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const justEmitted = ref(false)

const emitUpdate = (value) => {
  justEmitted.value = true
  emit('update:modelValue', value)
}

const transformValue = (value: string): string => {
  let transformedValue = value
  if (!value) return value
  if (!value.includes('.')) return `${value}.00`
  const decimal = value.split('.')[1]

  transformedValue =
    decimal.length > 2
      ? value.slice(0, 2 - decimal.length)
      : value.padEnd(value.length + (2 - decimal.length), '0')

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

const handleKeydown = (e) => {
  if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.code))
    return

  const valueSplitByDot = e.target.value.split('.')
  const hasDot = valueSplitByDot.length === 2
  const tooManyDecimals = hasDot && valueSplitByDot[1].length === 2
  const invalidCharacter =
    (isNaN(Number(e.key)) && (e.key !== '.' || hasDot)) || e.code === 'Space'
  if (invalidCharacter || tooManyDecimals) e.preventDefault()
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

    const stringVal = typeof n === 'string' ? n : n.toString()
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
