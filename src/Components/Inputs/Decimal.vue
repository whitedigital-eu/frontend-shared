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
      class="form-control w-full sm:min-w-[200px]"
      :class="{ 'sm:min-w-[432px]': long }"
      :readonly="readonly"
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

const emit = defineEmits(['update:modelValue'])

const handleFocus = () => (hasFocus.value = true)
const handleBlur = () => {
  hasFocus.value = false
  value.value = valueTransformOnBlur(value.value)
  emit('update:modelValue', value.value)
}

const inputRef = ref<HTMLInputElement | undefined>()
const value = ref('')
const hasFocus = ref(false)
const isEmpty = computed(() => !value.value)

const handleInput = (e: InputEvent) => {
  const targetValue: string = (e.target as HTMLInputElement).value
  emit('update:modelValue', targetValue)
}

const handleLabelClick = () => {
  inputRef.value?.focus()
}

watch(
  () => props.modelValue,
  (n) => (value.value = n as string),
  { immediate: true }
)

const valueTransformOnBlur = (value: string): string => {
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
</script>

<style lang="scss" scoped>
input {
  display: block;
  appearance: none;
  transition: all 0.2s ease-in-out;
}
</style>
