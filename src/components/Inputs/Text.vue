<template>
  <div class="relative" :class="{ 'overflow-hidden': isEmpty && !hasFocus }">
    <FormFieldLabel
      v-if="label"
      :is-placeholder="isEmpty && !hasFocus"
      @click="handleLabelClick"
    >
      {{ props.label }}
    </FormFieldLabel>
    <input
      ref="inputRef"
      v-model="value"
      class="form-control sm:min-w-[200px] w-full"
      :class="{ 'sm:min-w-[416px]': long }"
      :readonly="readonly"
      type="text"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'
import { TextValue } from './ValueTypes'

const props = withDefaults(
  defineProps<{
    modelValue?: TextValue
    label?: string | null
    readonly?: boolean
    long?: boolean
  }>(),
  {
    modelValue: '',
    label: null,
    readonly: false,
    long: false,
  }
)

const emit = defineEmits(['update:modelValue'])

const handleFocus = () => {
  if (props.readonly) return
  hasFocus.value = true
}
const handleBlur = () => (hasFocus.value = false)

const inputRef = ref<HTMLInputElement | undefined>()
const value = ref('')
const hasFocus = ref(false)
const isEmpty = computed(() => !value.value)

const handleInput = (e: Event) => {
  const targetValue: string = (e.target as HTMLInputElement).value
  emit('update:modelValue', targetValue)
}

const handleLabelClick = () => {
  if (props.readonly) return
  inputRef.value?.focus()
}

watch(
  () => props.modelValue,
  (n) => (value.value = n as string),
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
