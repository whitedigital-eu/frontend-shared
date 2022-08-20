<template>
  <div class="w-full sm:w-auto">
    <div v-if="item.type === 'text'" class="sm:flex flex-col items-center">
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
          :id="`filter-${item.label}`"
          v-model="item.value"
          :label="item.label"
          :config="item.config"
          :axios-instance="baseAxios"
        />
      </div>
    </div>
    <div v-if="item.type === 'date'" class="sm:flex items-center">
      <div class="w-full sm:w-[200px] flex-none grow">
        <Datepicker v-model="item.value" :label="item.label" />
      </div>
    </div>
    <div v-if="item.type === 'date-range'" class="sm:flex items-center">
      <div class="w-full flex-none grow sm:w-[432px]">
        <RangeDatepicker v-model="item.value" :label="item.label" class="" />
      </div>
    </div>
    <div
      v-if="item.type === 'radio-buttons'"
      class="sm:flex flex-col items-left"
    >
      <label class="mr-2 mb-2">{{ item.label }}</label>
      <div class="flex gap-4">
        <div v-for="option in item.config.options" :key="option.value">
          <input
            v-model="item.value"
            type="radio"
            :name="item.name"
            :value="option.value"
          />
          <label class="ml-1" @click="item.value = option.value">{{
            option.text
          }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Text from 'wd-frontend-shared/components/Inputs/Text.vue'
import SimpleSelect from 'wd-frontend-shared/components/Inputs/Selects/SimpleSelect.vue'
import Datepicker from 'wd-frontend-shared/components/Inputs/Datepicker.vue'
import RangeDatepicker from 'wd-frontend-shared/components/Inputs/RangeDatepicker.vue'
import DataFetchingSelect from 'wd-frontend-shared/components/Inputs/Selects/DataFetchingSelect.vue'
import Checkbox from 'wd-frontend-shared/components/Inputs/Checkbox.vue'
import Filter from '../../Models/Filters'
import { baseAxios } from '../../Axios/createAxiosInstance'

const props = defineProps<{
  item: Filter
}>()
</script>

<style></style>
