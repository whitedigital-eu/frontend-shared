<template>
  <BaseSelect
    :id="id"
    :key="baseSelectKey"
    v-model="value"
    :config="computedConfig"
    :label="label"
    :search-input-placeholder="searchInputPlaceholder"
    @create-new-item="(item) => emit('create-new-item', item)"
    @update:model-value="handleInput"
  />
</template>

<script setup lang="ts" generic="T extends string | number">
import { computed, ref, watch } from 'vue'
import BaseSelect from './BaseSelect.vue'
import { DataFetchingSelectConfig } from '../../../types/InputFields'
import { AxiosInstance } from 'axios'
import { SelectOption } from '../../../models/FormFields'
import _ from 'lodash'

const props = withDefaults(
  defineProps<{
    id: string
    config: DataFetchingSelectConfig<T>
    modelValue?: T | T[] | null
    label?: string
    axiosInstance: AxiosInstance
  }>(),
  {
    modelValue: null,
    label: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | number]
  'create-new-item': [itemName: string | undefined]
}>()

const defaultMinSymbolsForSearch = 3
const searchInputPlaceholder = `Ievadiet vismaz ${defaultMinSymbolsForSearch} simbolus!`

const computedConfig = computed(() =>
  _.merge(
    {
      readonly: false,
      allowDelete: true,
      tomSelectSettings: {
        shouldLoad: (query: string) =>
          query.length >= defaultMinSymbolsForSearch,
        async load(
          searchValue: string,
          callback: (options: SelectOption[]) => void,
        ) {
          const requestUrl = props.config.requestUrlGenerator(searchValue)
          const res = await props.axiosInstance.get(requestUrl)
          const options: { value: string; text: string }[] = res.data[
            'hydra:member'
          ].map(props.config.responseMapFunction)
          callback(options)
        },
        options: [],
      },
    },
    props.config,
  ),
)

const baseSelectKey = computed(() =>
  JSON.stringify([
    computedConfig.value.tomSelectSettings.options,
    computedConfig.value.tomSelectSettings.create,
  ]),
)

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
