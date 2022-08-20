<template>
  <div
    class="flex flex-col sm:flex-row sm:items-end xl:items-start"
    data-test="filters"
  >
    <form
      id="tabulator-html-filter-form"
      class="xl:flex xl:flex-col sm:mr-auto items-start mb-4 w-full"
      @submit.prevent="emit('queryParamsChanged', filters)"
    >
      <div class="flex flex-col grow">
        <div
          class="flex flex-wrap gap-8"
          :class="{ 'mb-6': noAdvancedFilters }"
        >
          <FilterInput
            v-for="(item, i) in filters.default"
            :item="item"
            :key="i"
          />
        </div>
        <div
          v-if="!noAdvancedFilters"
          id="advanced-filters"
          class="flex flex-wrap gap-8 mt-4 mb-6"
        >
          <FilterInput
            v-for="(item, i) in filters.advanced"
            :item="item"
            :key="i"
          />
        </div>
      </div>
      <div class="flex justify-between w-full">
        <div class="xl:mt-0 flex gap-2">
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
            class="btn btn-secondary w-full sm:w-32 mt-2 sm:mt-0"
            data-test="filters-reset-btn"
            @click="resetFilter"
          >
            Dzēst filtrus
          </button>
        </div>
        <div>
          <slot></slot>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref, watch } from 'vue'
import FilterInput from './FilterInput.vue'
import 'flatpickr/dist/flatpickr.css'
import { getQueryParam } from 'wd-frontend-shared/helpers/Global'
import { Filters } from '../../Models/Filters'
import dayjs from 'dayjs'

const props = defineProps({
  filters: {
    type: Object as PropType<Filters>,
    required: true,
  },
})

const emit = defineEmits(['queryParamsChanged'])

const filter = () => {
  const data = filtersToQueryParams()
  updateQueryParams(data)
  emit('queryParamsChanged', data)
}

const noAdvancedFilters = computed(
  () => !props.filters.advanced || !props.filters.advanced.length
)

const types = ['default', 'advanced']

const resetFilter = () => {
  types.forEach((type: string) => {
    if (props.filters[type]) {
      props.filters[type].forEach((item) => {
        item.value = ''
      })
    }
  })
  updateQueryParams('')
  emit('queryParamsChanged', '')
}

const updateQueryParams = (data: string) => {
  const page = getQueryParam('page') ?? 1
  let size = getQueryParam('size')
  size = size ? `&size=${size}` : ''
  data = data ? `&${data}` : ''
  const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?page=${page}${size}${data}`
  window.history.pushState({ path: newUrl }, '', newUrl)
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

const filtersToQueryParams = () => {
  let filterQueryParams: string[] = []

  types.forEach((type: string) => {
    if (props.filters[type]) {
      props.filters[type].forEach((item) => {
        if (item.value === '') return

        if (item.name === 'document-date') {
          const params = createDateRangeQueryParams(item.value, 'date')
          if (params) filterQueryParams.push(...params)
        } else if (item.name === 'audits-date') {
          const params = createDateRangeQueryParams(item.value, 'created')
          if (params) filterQueryParams.push(...params)
        } else if (item.toggleExact) {
          const computedName = `${item.name}[${
            item.exact ? 'exact' : 'ipartial'
          }]`
          filterQueryParams.push(
            `${computedName}=${encodeURIComponent(item.value)}`
          )
        } else {
          filterQueryParams.push(
            `${item.name}=${encodeURIComponent(item.value)}`
          )
        }
      })
    }
  })

  return filterQueryParams.join('&')
}

const setFilterInitialValues = () => {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())

  for (const param in params) {
    types.forEach((type: string) => {
      const filterIndex = props.filters[type].findIndex(
        (filter) => filter.name === param
      )
      if (filterIndex !== -1)
        props.filters[type][filterIndex].value = params[param]
    })
  }

  const emitValue: string = filtersToQueryParams()
  if (emitValue) emit('queryParamsChanged', emitValue)
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
</script>
