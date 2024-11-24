<template>
  <div class="w-full" :class="containerClass">
    <div
      v-if="item.type === 'text' && !Array.isArray(item.value)"
      class="flex-col items-center sm:flex"
    >
      <Text
        v-model="item.value"
        class="grow"
        :config="{
          inputAttributes: {
            class: { 'sm:min-w-[416px]': isMultisearchInput },
          },
        }"
        :label="item.label"
      />
      <label v-if="item.toggleExact" class="flex mt-1">
        <span class="first-letter:capitalize">
          {{ t('project.searchExactly') }}
        </span>
        <Checkbox v-model="item.exact" />
      </label>
      <span v-if="item.description && !item.exact" class="mt-2 w-full">
        {{ item.description }}
      </span>
    </div>
    <SimpleSelect
      v-if="item.type === 'simple-select'"
      :id="`filter-${item.label}`"
      v-model="item.value"
      class="w-full"
      :config="item.config as SelectConfig"
      :label="item.label"
      :required="false"
    />
    <DataFetchingSelect
      v-if="
        item.type === 'data-fetching-select' &&
        isDataFetchingSelectConfig(item.config)
      "
      :id="`filter-${item.label}`"
      v-model="item.value"
      class="w-full"
      :config="item.config"
      :label="item.label"
    />
    <Datepicker
      v-if="item.type === 'date'"
      v-model="item.value as string | null"
      class="w-full"
      :label="item.label"
    />
    <RangeDatepicker
      v-if="item.type === 'date-range'"
      v-model="item.value as string[] | null"
      class="w-full"
      :label="item.label"
    />
    <div
      v-if="item.type === 'radio-buttons'"
      class="flex-col items-left sm:flex"
    >
      <label class="mb-2 mr-2">{{ item.label }}</label>
      <div v-if="item.config" class="flex gap-4">
        <div
          v-for="option in item.config?.tomSelectSettings?.options ?? []"
          :key="option.value"
        >
          <input
            v-model="item.value"
            :name="item.name"
            type="radio"
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
import { DataFetchingSelectConfig, SelectConfig } from '../../types/InputFields'
import { computed } from 'vue'
import { useI18nWithFallback } from '../../helpers/Translations'

const { item } = defineProps<{ item: Filter }>()

const { t } = useI18nWithFallback()

const isDataFetchingSelectConfig = (
  x: SelectConfig | DataFetchingSelectConfig | null,
): x is DataFetchingSelectConfig =>
  x !== null &&
  'loadOptionsFunction' in x &&
  typeof x.loadOptionsFunction === 'function'

const isDateRangeInput = computed(() => item.type === 'date-range')
const isMultisearchInput = computed(() => item.name === 'multisearch')

const standardWidth = 200
const gap = 16
const doubleWidth = 2 * standardWidth + gap
// cannot use variables in class definitions so tailwind picks them up
const standardWidthClass = `sm:w-[200px]` // based on standardWidth
const doubleWidthClass = `sm:w-[416px]` // based on doubleWidth

const containerClass = computed(() =>
  isDateRangeInput.value || isMultisearchInput.value
    ? doubleWidthClass
    : standardWidthClass,
)
</script>
