<template>
  <div class="w-full sm:w-auto">
    <div
      v-if="item.type === 'text' && !Array.isArray(item.value)"
      class="sm:flex flex-col items-center"
    >
      <Text
        v-model="item.value"
        class="grow"
        :label="item.label"
        :long="item.name === 'multisearch'"
      />
      <label class="flex mt-1" v-if="item.toggleExact">
        <span>Meklēt precīzi </span>
        <Checkbox v-model="item.exact" />
      </label>
      <span v-if="item.description && !item.exact" class="w-[200px] mt-2">
        {{ item.description }}
      </span>
    </div>
    <div v-if="item.type === 'simple-select'" class="sm:flex items-center">
      <div class="w-full sm:w-[200px] flex-none grow">
        <SimpleSelect
          :id="`filter-${item.label}`"
          v-model="item.value"
          :label="item.label"
          :required="false"
          :config="item.config"
        />
      </div>
    </div>
    <div
      v-if="item.type === 'data-fetching-select'"
      class="sm:flex items-center"
    >
      <div class="w-full sm:w-[200px] flex-none grow">
        <DataFetchingSelect
          v-if="props.axiosInstance && isDataFetchingSelectConfig(item.config)"
          :id="`filter-${item.label}`"
          v-model="item.value"
          :label="item.label"
          :config="castToDataFetchingSelect(item.config)"
          :axios-instance="props.axiosInstance"
        />
      </div>
    </div>
    <div
      v-if="
        item.type === 'date' &&
        (item.value === '' || !Array.isArray(item.value))
      "
      class="sm:flex items-center"
    >
      <div class="w-full sm:w-[200px] flex-none grow">
        <Datepicker v-model="item.value" :label="item.label" />
      </div>
    </div>
    <div
      v-if="
        item.type === 'date-range' &&
        (item.value === '' || Array.isArray(item.value))
      "
      class="sm:flex items-center"
    >
      <div class="w-full flex-none grow sm:w-[416px]">
        <RangeDatepicker v-model="item.value" :label="item.label" />
      </div>
    </div>
    <div
      v-if="item.type === 'radio-buttons'"
      class="sm:flex flex-col items-left"
    >
      <label class="mr-2 mb-2">{{ item.label }}</label>
      <div class="flex gap-4" v-if="item.config">
        <div v-for="option in item.config.options" :key="option.value">
          <input
            v-model="item.value"
            type="radio"
            :name="item.name"
            :value="option.value"
          />
          <label class="ml-1" @click="item.value = option.value">
            {{ option.text }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Text from '../../components/Inputs/Text.vue'
import SimpleSelect from '../../components/Inputs/Selects/SimpleSelect.vue'
import Datepicker from '../../components/Inputs/Datepicker.vue'
import RangeDatepicker from '../../components/Inputs/RangeDatepicker.vue'
import DataFetchingSelect from '../../components/Inputs/Selects/DataFetchingSelect.vue'
import Checkbox from '../../components/Inputs/Checkbox.vue'
import { Filter } from '../../types/Filters'
import { AxiosInstance } from 'axios'
import {
  DataFetchingSelectConfig,
  SimpleSelectConfig,
} from '../../types/InputFields'

const props = defineProps<{
  item: Filter
  axiosInstance?: AxiosInstance
}>()

const isDataFetchingSelectConfig = (
  x: SimpleSelectConfig | DataFetchingSelectConfig | null
): x is DataFetchingSelectConfig => {
  return (
    x !== null &&
    'requestUrlGenerator' in x &&
    typeof x.requestUrlGenerator === 'function' &&
    'responseMapFunction' in x &&
    typeof x.responseMapFunction === 'function'
  )
}

const castToDataFetchingSelect = (
  x: SimpleSelectConfig | DataFetchingSelectConfig | null
) => {
  if (isDataFetchingSelectConfig(x)) return x
  else {
    console.error(
      'Property to be cast to DataFetchingSelectConfig is not DataFetchingSelectConfig!!!'
    )
    return x as DataFetchingSelectConfig
  }
}
</script>
