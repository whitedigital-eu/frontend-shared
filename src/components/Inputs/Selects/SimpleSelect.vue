<template>
  <BaseSelect
    :id="props.id"
    v-model="value"
    :allow-delete="allowDelete"
    :label="label"
    :readonly="props.readonly"
    :settings="props.config"
    @create-new-item="(item) => emit('create-new-item', item)"
    @update:model-value="handleInput"
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
  allowDelete: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | number]
  'create-new-item': [itemName: string | undefined]
}>()

const value = ref()

const handleInput = (value: string | string[] | number) => {
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  (n) => (value.value = n),
  { immediate: true }
)
</script>
