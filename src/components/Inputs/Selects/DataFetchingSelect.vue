<template>
  <BaseSelect
    :id="id"
    v-model="value"
    :settings="settings"
    :label="label"
    @update:modelValue="handleInput"
  />
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import BaseSelect from './BaseSelect.vue'
import { DataFetchingSelectConfig } from '../../../types/InputFields'
import { AxiosInstance } from 'axios'
import { DataFetchingSelectValue } from '../ValueTypes'
import { TomSettings } from 'tom-select/src/types'

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
})

const settings: Partial<TomSettings> = {
  shouldLoad: (query) => query.length >= 3,
  async load(searchValue, callback) {
    const requestUrl = props.config.requestUrlGenerator(searchValue)
    const res = await props.axiosInstance.get(requestUrl)
    const options: { value: string; text: string }[] = res.data[
      'hydra:member'
    ].map(props.config.responseMapFunction)

    //@ts-ignore
    callback(options)
  },
}

if (props.config.options) {
  settings.options = { ...props.config.options }
}

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
