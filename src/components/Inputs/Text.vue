<template>
  <div
    class="relative"
    :class="{ 'overflow-hidden': isEmpty && !hasFocus }"
    v-bind="config.wrapperAttributes"
  >
    <FormFieldLabel
      v-if="label"
      v-bind="config.labelAttributes"
      :is-placeholder="isEmpty && !hasFocus"
      @click="handleLabelClick"
    >
      {{ props.label }}
    </FormFieldLabel>
    <input
      v-bind="config.inputAttributes"
      ref="inputRef"
      v-model="value"
      class="form-control sm:min-w-[200px] w-full"
      :readonly="config.readonly"
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
import { TextProps } from './PropTypes'

const props = withDefaults(defineProps<TextProps>(), {
  modelValue: '',
  label: null,
  config: () => ({
    readonly: false,
    wrapperAttributes: {},
    labelAttributes: {},
    inputAttributes: {},
  }),
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const handleFocus = () => {
  if (props.config.readonly) return
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
  if (props.config.readonly) return
  inputRef.value?.focus()
}

watch(
  () => props.modelValue,
  (n) => (value.value = n as string),
  { immediate: true },
)
</script>

<style lang="scss" scoped>
input {
  display: block;
  appearance: none;
  transition: all 0.2s ease-in-out;
}
</style>
