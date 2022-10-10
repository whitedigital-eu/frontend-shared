<template>
  <div class="relative" :class="{ 'overflow-hidden': isEmpty && !hasFocus }">
    <FormFieldLabel
      v-if="label"
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
import { computed, ref, watch } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
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

const handleInput = (e: InputEvent) => {
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
