<template>
  <BaseSelect
    :key="baseSelectKey"
    :id="id"
    v-model="value"
    :settings="settings"
    :label="label"
    :allow-delete="allowDelete"
    :search-input-placeholder="searchInputPlaceholder"
    @update:model-value="handleInput"
  />
</template>

<script setup lang="ts">
import { computed, PropType, ref, watch, watchEffect } from 'vue'
import BaseSelect from './BaseSelect.vue'
import { DataFetchingSelectConfig } from '../../../types/InputFields'
import { AxiosInstance } from 'axios'
import { DataFetchingSelectValue } from '../ValueTypes'
import type { RecursivePartial, TomSettings } from 'tom-select/src/types'
import { SelectOption } from '../../../models/SelectOption'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  config: {
    type: Object as PropType<DataFetchingSelectConfig>,
    required: true,
  },
  modelValue: {
    type: [String, Array] as PropType<DataFetchingSelectValue>,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: '',
  },
  axiosInstance: {
    type: Function as PropType<AxiosInstance>,
    required: true,
  },
  allowDelete: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const minSymbolsForSearch = 3
const searchInputPlaceholder = computed(
  () => `Ievadiet vismaz ${minSymbolsForSearch} simbolus!`
)

const settings: RecursivePartial<TomSettings> = {
  shouldLoad: (query: string) => query.length >= minSymbolsForSearch,
  async load(searchValue: string, callback: (options: SelectOption[]) => void) {
    const requestUrl = props.config.requestUrlGenerator(searchValue)
    const res = await props.axiosInstance.get(requestUrl)
    const options: { value: string; text: string }[] = res.data[
      'hydra:member'
    ].map(props.config.responseMapFunction)
    callback(options)
  },
}

const baseSelectKey = ref(0)

watchEffect(() => {
  if (props.config.options) {
    settings.options = props.config.options as RecursivePartial<SelectOption[]>
    baseSelectKey.value++
  }
  if (props.config.create) {
    settings.create = props.config.create
    baseSelectKey.value++
  }
})

const emit = defineEmits(['update:modelValue'])

const value = ref()

const handleInput = (value: string | string[]) => {
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  (n) => (value.value = n),
  { immediate: true }
)
</script>
