<template>
  <div>
    <button
      v-if="isMobile && showMobileToggleButton"
      class="btn btn-primary w-full mb-4"
      @click="showFilters = !showFilters"
    >
      <span>{{ showFilters ? 'Paslēpt' : 'Parādīt' }} filtrus</span>
      <span v-show="showFilters">
        <i data-lucide="chevron-down" class="h-4 w-4"> </i>
      </span>
      <span v-show="!showFilters">
        <i data-lucide="chevron-up" class="h-4 w-4"></i>
      </span>
    </button>
    <div
      class="flex flex-col sm:flex-row sm:items-end xl:items-start"
      data-test="filters"
    >
      <form
        id="tabulator-html-filter-form"
        class="xl:flex xl:flex-col sm:mr-auto items-start mb-4 w-full"
        @submit.prevent="filter"
      >
        <div v-show="showFilters" class="flex flex-col grow">
          <div
            class="flex flex-wrap gap-4"
            :class="{ 'mb-6': noAdvancedFilters }"
          >
            <FilterInput
              v-for="(item, i) in filters.default"
              :item="item"
              :key="i"
              :axios-instance="axiosInstance"
            />
            <button
              v-if="!noAdvancedFilters && toggleAdvancedFilters"
              @click="showAdvancedFilters = !showAdvancedFilters"
              type="button"
              class="btn btn-primary h-10"
            >
              Detalizēta meklēšana
              <ChevronDown v-if="showAdvancedFilters" :size="20" class="ml-2" />
              <ChevronUp v-if="!showAdvancedFilters" :size="20" class="ml-2" />
            </button>
          </div>
          <div
            v-if="!noAdvancedFilters"
            v-show="showAdvancedFilters"
            id="advanced-filters"
            class="flex flex-wrap gap-4 mt-4 mb-6"
          >
            <FilterInput
              v-for="(item, i) in filters.advanced"
              :item="item"
              :key="i"
              :axios-instance="axiosInstance"
            />
          </div>
        </div>
        <div
          class="flex flex-col sm:flex-row justify-between w-full"
          :class="{ 'mt-4': !showAdvancedFilters }"
        >
          <slot
            name="action-buttons"
            :filter-function="filter"
            :reset-filter-function="resetFilter"
            :show-filters="showFilters"
            :toggle-show-filters="toggleShowFilters"
          >
            <div
              v-show="showFilters"
              class="xl:mt-0 flex gap-2 w-full sm:w-auto"
            >
              <button
                type="submit"
                class="btn btn-primary w-full sm:w-16 h-[38px] mt-2 sm:mt-0"
                data-test="filters-search-btn"
                @click.prevent="filter"
              >
                Meklēt
              </button>
              <button
                id="tabulator-html-filter-reset"
                type="button"
                class="btn btn-secondary w-full sm:w-32 h-[38px] mt-2 sm:mt-0"
                data-test="filters-reset-btn"
                @click="resetFilter"
              >
                Dzēst filtrus
              </button>
            </div>
          </slot>
          <div>
            <slot></slot>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FilterInput from './FilterInput.vue'
import 'flatpickr/dist/flatpickr.css'
import { Filters } from '../../types/Filters'
import dayjs from 'dayjs'
import { AxiosInstance } from 'axios'
import useResponsivity from '../../composables/useResponsivity'
import { TableConfig } from './createTableConfig'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    filters: Filters
    axiosInstance?: AxiosInstance
    config?: TableConfig | null
    toggleAdvancedFilters?: boolean
    initialShowFiltersDesktop?: boolean
    showMobileToggleButton?: boolean
  }>(),
  {
    config: null,
    toggleAdvancedFilters: false,
    initialShowFiltersDesktop: true,
    showMobileToggleButton: true,
  }
)

const emit = defineEmits<{
  (
    e: 'update:query-params',
    data: ReturnType<typeof filtersToQueryParams>
  ): void
}>()

const { isMobile } = useResponsivity()
const showFilters = ref(!isMobile.value && props.initialShowFiltersDesktop)

const filter = () => {
  emit('update:query-params', filtersToQueryParams())
}

const noAdvancedFilters = computed(
  () => !props.filters.advanced || !props.filters.advanced.length
)

const showAdvancedFilters = ref(
  !noAdvancedFilters.value && !props.toggleAdvancedFilters
)

const types = ['default', 'advanced'] as const

const resetFilter = () => {
  types.forEach((type) => {
    if (props.filters[type]) {
      props.filters[type].forEach((item) => (item.value = ''))
    }
  })
  emit('update:query-params', {})
}

const createDateRangeQueryParams = (
  value: [number, number],
  searchProperty: string
) => {
  if (value.length < 2) return

  const start = dayjs(value[0]).hour(0).minute(0).toISOString()
  const end = dayjs(value[1]).hour(23).minute(59).toISOString()

  return [
    `${searchProperty}[after]=${start}`,
    `${searchProperty}[before]=${end}`,
  ]
}

const createDateRangeQueryParamsArr = (
  value: [number, number],
  searchProperty: string
) => {
  if (value.length < 2) return

  const start = dayjs(value[0]).hour(0).minute(0).toISOString()
  const end = dayjs(value[1]).hour(23).minute(59).toISOString()

  return {
    [`${searchProperty}[after]`]: start,
    [`${searchProperty}[before]`]: end,
  }
}

const filtersToQueryParams = () => {
  const objParams: Record<string, string> = {}

  types.forEach((type) => {
    if (props.filters[type]) {
      props.filters[type].forEach((item) => {
        if (item.value === '') return

        if (item.name === 'document-date') {
          //@ts-ignore
          const params = createDateRangeQueryParams(item.value, 'date')
          //@ts-ignore
          const paramsObj = createDateRangeQueryParamsArr(item.value, 'date')

          if (params) {
            Object.assign(objParams, paramsObj)
          }
        } else if (item.name === 'audits-date' || item.name === 'audit-date') {
          const params = createDateRangeQueryParams(
            //@ts-ignore
            item.value,
            props.config?.sharedColumnNames.created ?? 'created'
          )
          const paramsObj = createDateRangeQueryParamsArr(
            //@ts-ignore
            item.value,
            props.config?.sharedColumnNames.created ?? 'created'
          )

          if (params) {
            Object.assign(objParams, paramsObj)
          }
        } else if (item.name === 'activity-date') {
          //@ts-ignore
          const params = createDateRangeQueryParams(item.value, 'fromDate')
          const paramsObj = createDateRangeQueryParamsArr(
            //@ts-ignore
            item.value,
            'fromDate'
          )

          if (params) {
            Object.assign(objParams, paramsObj)
          }
        } else if (item.toggleExact) {
          const computedName = `${item.name}[${
            item.exact ? 'exact' : 'ipartial'
          }]`
          //@ts-ignore
          objParams[computedName] = item.value
        } else {
          //@ts-ignore
          objParams[item.name] = item.value
        }
      })
    }
  })

  return objParams
}

const setFilterInitialValues = () => {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())

  for (const param in params) {
    types.forEach((type) => {
      const filterIndex = props.filters[type].findIndex(
        (filter) => filter.name === param
      )
      if (filterIndex !== -1)
        props.filters[type][filterIndex].value = params[param]
    })
  }

  emit('update:query-params', filtersToQueryParams())
}

const filterInitialValuesSet = ref(false)

watch(
  props.filters,
  (n) => {
    if (!n) return
    if (!filterInitialValuesSet.value) {
      setFilterInitialValues()
      filterInitialValuesSet.value = true
    }
  },
  { immediate: true }
)

const toggleShowFilters = () => {
  showFilters.value = !showFilters.value
}
</script>
