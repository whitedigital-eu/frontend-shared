<template>
  <div>
    <label
      class="form-label cursor-pointer mr-2"
      @click="emit('update:modelValue', !value)"
      >{{ label }}</label
    >
    <input
      v-model="value"
      type="checkbox"
      class="form-check-input"
      :readonly="readonly"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: false,
    default: false,
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
  label: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const value = ref(false)

const handleChange = (e: Event) => {
  const targetValue: boolean = (e.target as HTMLInputElement).checked
  emit('update:modelValue', targetValue)
}

watch(
  () => props.modelValue,
  (n) => (value.value = n as boolean),
  { immediate: true }
)
</script>

<style lang="scss" scoped>
label {
  transform: translateY(2px);
}
</style>
