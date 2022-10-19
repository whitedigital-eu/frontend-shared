<template>
  <BaseSelect
    :id="props.id"
    v-model="value"
    :settings="props.config"
    :readonly="props.readonly"
    :label="label"
    @update:modelValue="handleInput"
    @create-new-item="(item) => emit('create-new-item', item)"
  />
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import BaseSelect from './BaseSelect.vue'
import { SimpleSelectValue } from '../ValueTypes'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  config: {
    type: Object as PropType<any>,
    required: true,
  },
  modelValue: {
    type: [String, Array, null] as PropType<SimpleSelectValue>,
    required: false,
    default: '',
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

const emit = defineEmits(['update:modelValue', 'create-new-item'])

const value = ref()

const handleInput = (value: string | number) => {
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  (n) => (value.value = n),
  { immediate: true }
)
</script>
