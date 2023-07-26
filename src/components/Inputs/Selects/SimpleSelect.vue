<template>
  <BaseSelect
    :id="props.id"
    v-model="value"
    :allow-delete="allowDelete"
    :label="label"
    :readonly="props.readonly"
    :settings="props.config as unknown as RecursivePartial<TomSettings>"
    @create-new-item="(item) => emit('create-new-item', item)"
    @update:model-value="handleInput"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseSelect from './BaseSelect.vue'
import { SimpleSelectValue } from '../ValueTypes'
import { SimpleSelectConfig } from '../../../types/InputFields'
import { RecursivePartial, TomSettings } from 'tom-select/src/types'

const props = withDefaults(
  defineProps<{
    id: string
    modelValue?: SimpleSelectValue
    readonly?: boolean
    label?: string
    allowDelete?: boolean
    config?: SimpleSelectConfig | null
  }>(),
  {
    modelValue: '',
    readonly: false,
    label: '',
    allowDelete: true,
    config: null,
  }
)

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
