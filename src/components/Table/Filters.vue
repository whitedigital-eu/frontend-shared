<template>
  <div>
    <slot
      v-if="isMobile && showMobileToggleButton"
      name="mobile-toggle-button"
      :show-filters="showFilters"
      :toggle-show-filters="toggleShowFilters"
    >
      <button class="btn btn-primary mb-4 w-full" @click="toggleShowFilters">
        <span class="first-letter:capitalize">{{
          showFilters ? t('project.hideFilters') : t('project.showFilters')
        }}</span>
        <span v-show="showFilters">
          <i class="h-4 w-4" data-lucide="chevron-down"> </i>
        </span>
        <span v-show="!showFilters">
          <i class="h-4 w-4" data-lucide="chevron-up"></i>
        </span>
      </button>
    </slot>
    <div
      v-show="showFilters"
      class="flex flex-col sm:flex-row sm:items-end xl:items-start"
      data-test="filters"
    >
      <form
        id="tabulator-html-filter-form"
        class="items-start mb-4 sm:mr-auto w-full xl:flex xl:flex-col"
        @submit.prevent="filter"
      >
        <div class="flex flex-col grow">
          <div
            class="flex flex-wrap gap-4"
            :class="{ 'mb-6': noAdvancedFilters }"
          >
            <FilterInput
              v-for="(item, i) in filters.default"
              :key="i"
              :item="item"
            />
            <slot name="after-default-filters"></slot>
            <button
              v-if="!noAdvancedFilters && toggleAdvancedFilters"
              class="btn btn-primary h-10"
              type="button"
              @click="showAdvancedFilters = !showAdvancedFilters"
            >
              <span class="first-letter:capitalize">{{
                t('project.detailedSearch')
              }}</span>
              <ChevronDown v-if="showAdvancedFilters" class="ml-2" :size="20" />
              <ChevronUp v-if="!showAdvancedFilters" class="ml-2" :size="20" />
            </button>
          </div>
          <div
            v-if="!noAdvancedFilters"
            v-show="showAdvancedFilters"
            id="advanced-filters"
            class="flex flex-wrap gap-4 mb-6 mt-4"
          >
            <FilterInput
              v-for="(item, i) in filters.advanced"
              :key="i"
              :item="item"
            />
          </div>
        </div>
        <div
          class="flex flex-col gap-4 justify-between sm:flex-row w-full"
          :class="{ 'mt-4': !showAdvancedFilters }"
        >
          <slot
            :filter-function="filter"
            name="action-buttons"
            :reset-filter-function="resetFilter"
            :show-filters="showFilters"
            :toggle-show-filters="toggleShowFilters"
          >
            <div
              v-show="showFilters"
              class="flex gap-2 sm:w-auto w-full xl:mt-0"
            >
              <button
                class="btn btn-primary h-[38px] mt-2 sm:mt-0 sm:w-16 w-full"
                data-test="filters-search-btn"
                type="submit"
                @click.prevent="filter"
              >
                <span class="first-letter:capitalize">{{
                  t('project.search')
                }}</span>
              </button>
              <button
                id="tabulator-html-filter-reset"
                class="btn btn-secondary h-[38px] mt-2 sm:mt-0 sm:w-32 w-full"
                data-test="filters-reset-btn"
                type="button"
                @click="resetFilter"
              >
                <span class="first-letter:capitalize">{{
                  t('project.deleteFilters')
                }}</span>
              </button>
            </div>
          </slot>
          <div class="flex-grow text-right">
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
import { TableConfig } from './createTableConfig'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import { isNumericString } from '../../helpers/Global'
import useIsMobile from '../../composables/useIsMobile'
import { useI18nWithFallback } from '../../helpers/Translations'

const props = withDefaults(
  defineProps<{
    filters: Filters
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
  },
)

const emit = defineEmits<{
  'update:query-params': [data: ReturnType<typeof filtersToQueryParams> | null]
}>()

defineSlots<{
  default: {}
  'mobile-toggle-button': {
    showFilters: boolean
    toggleShowFilters: () => void
  }
  'action-buttons': {
    filterFunction: () => void
    resetFilterFunction: () => void
    showFilters: boolean
    toggleShowFilters: () => void
  }
  'after-default-filters': {}
}>()

const { isMobile } = useIsMobile()
const { t } = useI18nWithFallback()

const showFilters = ref(!isMobile.value && props.initialShowFiltersDesktop)

const filter = () => {
  emit('update:query-params', filtersToQueryParams())
}

const noAdvancedFilters = computed(
  () => !props.filters.advanced || !props.filters.advanced.length,
)

const showAdvancedFilters = ref(
  !noAdvancedFilters.value && !props.toggleAdvancedFilters,
)

const types = ['default', 'advanced'] as const

const resetFilter = () => {
  types.forEach((type) => {
    if (props.filters[type]) {
      props.filters[type].forEach((item) => (item.value = ''))
    }
  })
  emit('update:query-params', null)
}

const createDateRangeQueryParamsArr = (
  value: [string, string | number],
  searchProperty: string,
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
  const objParams: Record<string, string | string[] | number | number[]> = {}

  types.forEach((type) => {
    if (props.filters[type]) {
      props.filters[type].forEach((item) => {
        if (item.value === '') return

        if (item.type === 'date-range') {
          const searchProperty = (() => {
            switch (item.name) {
              case 'document-date':
                console.warn('Deprecated!')
                return 'date'
              case 'audits-date':
              case 'audit-date':
                console.warn('Deprecated!')
                return props.config?.sharedColumnNames.created ?? 'created'
              case 'activity-date':
                return 'fromDate'
              default:
                return item.name
            }
          })()

          const paramsObj = createDateRangeQueryParamsArr(
            item.value as [string, string | number],
            searchProperty,
          )
          if (paramsObj) Object.assign(objParams, paramsObj)
        } else if (item.toggleExact) {
          const computedName = `${item.name}[${
            item.exact ? 'exact' : 'ipartial'
          }]`
          objParams[computedName] = item.value
        } else {
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
        (filter) => filter.name === param,
      )
      if (filterIndex === -1) return

      //@ts-ignore
      props.filters[type][filterIndex].value = isNumericString(params[param])
        ? parseInt(params[param])
        : params[param]
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
  { immediate: true },
)

const toggleShowFilters = () => {
  showFilters.value = !showFilters.value
}

defineExpose({ toggleShowFilters, filter, resetFilter })
</script>
