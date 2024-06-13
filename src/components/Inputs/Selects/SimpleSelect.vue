<template>
  <BaseSelect
    :id="props.id"
    :key="baseSelectKey"
    v-model="value"
    :config="props.config"
    :label="label"
    @create-new-item="(item) => $emit('create-new-item', item)"
    @update:model-value="(value) => $emit('update:modelValue', value)"
  />
</template>

<script setup lang="ts" generic="T extends string | number">
import { computed, ref, watch } from 'vue'
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

defineEmits<{
  'update:modelValue': [value: typeof props.modelValue]
  'create-new-item': [itemName: string | undefined]
}>()

const value = ref<typeof props.modelValue>()

const baseSelectKey = computed(() =>
  JSON.stringify([
    props.config?.tomSelectSettings?.options,
    props.config?.tomSelectSettings?.create,
  ]),
)

watch(
  () => props.modelValue,
  (n) => (value.value = n),
  { immediate: true },
)
</script>
