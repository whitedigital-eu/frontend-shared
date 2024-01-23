<template>
  <BaseSelect
    :id="id"
    :key="baseSelectKey"
    v-model="value"
    :allow-delete="allowDelete"
    :label="label"
    :search-input-placeholder="searchInputPlaceholder"
    :settings="settings"
    @create-new-item="(item) => emit('create-new-item', item)"
    @update:model-value="handleInput"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import BaseSelect from './BaseSelect.vue'
import { DataFetchingSelectConfig } from '../../../types/InputFields'
import { AxiosInstance } from 'axios'
import { DataFetchingSelectValue } from '../ValueTypes'
import type { RecursivePartial, TomSettings } from 'tom-select/src/types'
import { SelectOption } from '../../../models/FormFields'
import { Modify } from '../../../site-tree/Types/Shared'

const props = withDefaults(
  defineProps<{
    id: string
    config: DataFetchingSelectConfig
    modelValue: DataFetchingSelectValue
    label?: string
    axiosInstance: AxiosInstance
    allowDelete?: boolean
  }>(),
  {
    label: '',
    allowDelete: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | number]
  'create-new-item': [itemName: string | undefined]
}>()

const minSymbolsForSearch = 3
const searchInputPlaceholder = computed(
  () => `Ievadiet vismaz ${minSymbolsForSearch} simbolus!`,
)

const settings: Modify<
  RecursivePartial<TomSettings>,
  { options: SelectOption[] }
> = {
  shouldLoad: (query: string) => query.length >= minSymbolsForSearch,
  async load(searchValue: string, callback: (options: SelectOption[]) => void) {
    const requestUrl = props.config.requestUrlGenerator(searchValue)
    const res = await props.axiosInstance.get(requestUrl)
    const options: { value: string; text: string }[] = res.data[
      'hydra:member'
    ].map(props.config.responseMapFunction)
    callback(options)
  },
  options: [],
}

const baseSelectKey = ref(0)

watchEffect(() => {
  if (props.config.options) {
    settings.options = props.config.options
    baseSelectKey.value++
  }
  if (props.config.create) {
    settings.create = props.config.create
    baseSelectKey.value++
  }
})

const value = ref()

const handleInput = (value: string | string[] | number) => {
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  (n) => (value.value = n),
  { immediate: true },
)
</script>
