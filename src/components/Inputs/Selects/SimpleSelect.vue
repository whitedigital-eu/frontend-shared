<template>
  <BaseSelect
    :id="props.id"
    v-model="value"
    :config="props.config"
    :label="label"
    @create-new-item="(item) => emit('create-new-item', item)"
    @update:model-value="handleInput"
  />
</template>

<script setup lang="ts" generic="T extends string">
import { ref, watch } from 'vue'
import BaseSelect from './BaseSelect.vue'
import { SelectConfig } from '../../../types/InputFields'

const props = withDefaults(
  defineProps<{
    id: string
    modelValue?: T | T[] | null
    label?: string
    config?: SelectConfig<T> | null
  }>(),
  {
    modelValue: null,
    label: '',
    config: null,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | number]
  'create-new-item': [itemName: string | undefined]
}>()

const value = ref<T | T[] | null>()

const handleInput = (value: string | string[] | number) => {
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  (n) => (value.value = n),
  { immediate: true },
)
</script>
