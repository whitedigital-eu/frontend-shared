<template>
  <div>
    <label
      class="form-label mr-2 translate-y-0.5"
      :class="
        readonly
          ? 'opacity-50 cursor-not-allowed'
          : 'opacity-100 cursor-pointer'
      "
      @click="!readonly && emit('update:modelValue', !value)"
    >
      {{ label }}
    </label>
    <input
      v-model="value"
      class="form-check-input"
      :disabled="readonly"
      type="checkbox"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { CheckboxProps } from './PropTypes'

const {
  modelValue = false,
  readonly = false,
  label = null,
} = defineProps<CheckboxProps>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const value = ref(false)

const handleChange = (e: Event) => {
  const targetValue: boolean = (e.target as HTMLInputElement).checked
  emit('update:modelValue', targetValue)
}

watch(
  () => modelValue,
  (n) => (value.value = n as boolean),
  { immediate: true },
)
</script>
