<template>
  <div class="overflow-x-auto relative scrollbar-hidden" data-test="table">
    <div
      v-if="showTopPagination"
      class="flex flex-wrap gap-x-4 gap-y-2 items-baseline mb-2"
    >
      <div class="tabulator tabulator-top-pagination-placeholder"></div>
      <div
        v-if="totalEntryCount"
        class="table-total-entry-count"
        data-test="table-total-entry-count"
      >
        <span class="first-letter:capitalize">
          ({{ t('project.inTotal') }}: {{ totalEntryCount }})
        </span>
      </div>
      <div class="flex-1">
        <slot
          name="header-right"
          :table-api-response="tableApiResponse"
          :tabulator="tabulator"
        ></slot>
      </div>
    </div>
    <div
      id="tabulator"
      ref="table"
      class="table-report table-report--tabulator"
    ></div>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="ResourceInstance extends Record<string, unknown>"
>
import Tabulator from 'tabulator-tables'
import { onMounted, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import { handleTableAjaxError } from '../../helpers/Errors'
import createActionColumn from './ActionColumn'
import { ApiListResponse } from '../../types/ApiPlatform'
import { COLLAPSE_ORDER, createColumn } from './Column'
import {
  getVueCurrentLocale,
  tabulatorLanguages,
  useI18nWithFallback,
} from '../../helpers/Translations'
import { TableProps } from './createTableConfig'
import { capitalizeFirstLetter } from '../../helpers/Global'
import { HTTPError } from 'ky'
/*
 * Since only props can be generic (in other words, it is not possible to pass just a generic, without a prop),
 * we need the fake resourceType prop which is used only to get the generic type.
 * @see https://github.com/vuejs/core/pull/7963#issuecomment-1762516240
 * The prop must also be optional, otherwise there is a typescript error.
 * TODO: improve this in the future if possible.
 * */
const props = withDefaults(
  defineProps<TableProps & { resourceType?: ResourceInstance }>(),
  {
    delete: true,
    edit: true,
    view: false,
    created: true,
    updated: true,
    ajaxUrl: null,
    movableRows: false,
    disableOrderByDateColumns: false,
    selectionColumn: false,
    selectionCheckboxLabel: null,
    columnData: null,
    page: 1,
    pageSize: 30,
    canUpdateRecordFunc: () => true,
    tabulatorOptions: null,
    customActions: null,
    paginationSizeSelector: () => [10, 30, 100],
    resourceType: undefined,
    showTopPagination: true,
  },
)

const emit = defineEmits<{
  /**
   * Emitted on edit action button click
   * @arg resource - the resource rendered in the clicked row
   */
  'edit-click': [resource: ResourceInstance]
  /**
   * Emitted on delete action button click
   * @arg resource - the resource rendered in the clicked row
   */
  'delete-click': [resource: ResourceInstance]
  /**
   * Emitted on view action button click
   * @arg resource - the resource rendered in the clicked row
   */
  'view-click': [resource: ResourceInstance]
  /**
   * Emitted when a row has been moved
   * @arg row - tabulator row component of the row that was moved
   * @see https://tabulator.info/docs/4.9/components
   */
  'move-row': [row: Tabulator.RowComponent]
  /**
   * Emitted when table data has been loaded for the first time
   * @arg response - the full API response of the ajax request that loads the data
   */
  'set:filters': [response: ApiListResponse<ResourceInstance>]
  /**
   * Emitted when a row (or all rows) has been selected or deselected
   * @arg selectedRowData - the resource rendered in the selected row
   */
  'row-selection-changed': [selectedRowData: ResourceInstance[]]
  /**
   * Emitted when any table cell is clicked
   * @arg field - the name of the field of the clicked cell (as defined in `props.columns`)
   * @arg resource - the resource rendered in the row of the clicked column
   */
  'cell-click': [field: string, resource: ResourceInstance]
  /**
   * Emitted after a table page is loaded
   * @arg page - he number of the currently displayed page
   * @arg pageSize - the amount of entries displayed in the page
   * @arg sortingQueryObject - the sorting query object that can be passed to the API or saved in the URL
   */
  'page-loaded': [
    page: number,
    pageSize: number,
    sortingQueryObject: Record<string, Tabulator.SortDirection> | null,
  ]
  /**
   * Emitted every time new data is loaded into the table
   * @arg totalEntryCount - the total number of available items as returned by the API
   */
  'total-entry-count-changed': [totalEntryCount: number | null]
  /**
   * Emitted every time filters are changed
   * @arg resources - the data entries returned by the API
   */
  'data-loaded': [resources: ResourceInstance[]]
}>()

defineSlots<{
  /** a slot in the top right side of the table on desktop, which collapses on mobile */
  'header-right'(props: {
    tableApiResponse: typeof tableApiResponse.value
    tabulator: Tabulator | undefined
  }): any
}>()

const { t } = useI18nWithFallback()

const table = ref()
const tabulator = ref()
const totalEntryCount = ref<number | null>(null)

const reInitTable = () => tabulator.value.redraw()

const reInitOnResizeWindow = () => {
  window.addEventListener('resize', reInitTable)
}

onMounted(() => {
  initTabulator()
  reInitOnResizeWindow()
})

onBeforeUnmount(() => window.removeEventListener('resize', reInitTable))

const reload = () => {
  tabulator.value.destroy()
  initTabulator(true)
}

watch(() => props.ajaxUrl, reload)

watch(totalEntryCount, (n, o) => {
  if (n !== o) emit('total-entry-count-changed', n)
})

const createTimestampColumn = (
  title: string,
  field: string,
  hideLast: boolean,
): Tabulator.ColumnDefinition =>
  createColumn({
    title,
    field,
    width: 150,
    formatter: (cell) => props.config.dateTimeFormatter(cell.getValue()),
    headerSort: !props.disableOrderByDateColumns,
    responsive: hideLast ? COLLAPSE_ORDER.first : COLLAPSE_ORDER.second,
  })

const createdColumn = createTimestampColumn(
  t('project.created').toUpperCase(),
  props.config.sharedColumnNames.created,
  true,
)
const updatedColumn = createTimestampColumn(
  t('project.updated').toUpperCase(),
  props.config.sharedColumnNames.updated,
  false,
)

const actionColumn = createActionColumn<ResourceInstance>(
  props,
  {
    edit: (resource) => emit('edit-click', resource),
    delete: (resource) => emit('delete-click', resource),
    view: (resource) => emit('view-click', resource),
  },
  t,
)

const selectionColumn: Tabulator.ColumnDefinition = {
  title: '',
  formatter: 'rowSelection',
  titleFormatter: 'rowSelection',
  hozAlign: 'left',
  headerHozAlign: 'left',
  headerSort: false,
  width: 40,
  cellClick(e: Event, cell: Tabulator.CellComponent) {
    cell.getRow().toggleSelect()
  },
  tooltip: props.selectionCheckboxLabel ?? '',
  headerTooltip: capitalizeFirstLetter(t('project.markAll')),
  vertAlign: 'middle',
}

const columnsBefore: Tabulator.ColumnDefinition[] = []
const columnsAfter: Tabulator.ColumnDefinition[] = []

if (props.selectionColumn) {
  columnsBefore.push(selectionColumn)
}

if (props.created) {
  columnsAfter.push(createdColumn)
}

if (props.updated) {
  columnsAfter.push(updatedColumn)
}

if (props.view || props.edit || props.delete || props.customActions) {
  columnsAfter.push(actionColumn)
}

const columns = [...columnsBefore, ...props.columns, ...columnsAfter]

const filtersSet = ref(false)

const waitForToggleCollapseElementsRendered = (): Promise<
  NodeListOf<Element>
> => {
  return new Promise((resolve) => {
    let totalTimePassed = 0
    const interval = setInterval(() => {
      if (totalTimePassed > 10000) {
        clearInterval(interval)
      }

      const elements = document.querySelectorAll(
        '.tabulator-responsive-collapse-toggle',
      )
      if (!elements.length) totalTimePassed += 100
      else {
        clearInterval(interval)
        resolve(elements)
      }
    }, 100)
  })
}

const setTableHeight = () => {
  setTimeout(() => {
    const tabulatorTableEl = document.querySelector('.tabulator-table')
    if (!tabulatorTableEl) return
    const headerHeight = 170 // tried calculating on the fly but it was flaky. 120 is the normal height, but headers can span multiple rows and 170 accommodates 3 header rows...
    const heightInPx = window.getComputedStyle(tabulatorTableEl).height
    const newTabulatorHeight = parseInt(heightInPx) + headerHeight
    tabulator.value.setHeight(newTabulatorHeight)
  }, 50)
}

let tabulatorScrollTop = 0

const PAGE_SIZE_PARAM = 'itemsPerPage' as const

const tableApiResponse = ref<ApiListResponse<ResourceInstance> | null>(null)

/** the tabulator type for this is wrong */
type Sorter = {
  column?: Tabulator.ColumnComponent
  field: string
  dir: Tabulator.SortDirection
}

const transformSorters = (sorters: Sorter[]) => {
  if (sorters.length > 0) {
    const key = `order[${sorters[0]['field']}]`
    const value = sorters[0]['dir']
    return { key, value }
  }
  return null
}

const currentLocale = getVueCurrentLocale()

const initTabulator = async (resetPage = false) => {
  let options: Tabulator.Options = {
    paginationSizeSelector: props.paginationSizeSelector,
    paginationInitialPage: resetPage ? 1 : props.page,
    paginationSize: props.pageSize,
    paginationDataSent: { size: PAGE_SIZE_PARAM },
    layout: 'fitColumns',
    responsiveLayout: 'collapse',
    responsiveLayoutCollapseStartOpen: false,
    headerSort: true,
    placeholder: capitalizeFirstLetter(t('project.noDataFound')),
    /**
     * in case of english locale, provide an empty string to use default translations
     * @see https://tabulator.info/docs/4.9/localize
     * */
    locale: currentLocale.includes('en') ? '' : currentLocale,
    langs: tabulatorLanguages,
    columns,
    movableRows: props.movableRows,
    rowMoved(row) {
      emit('move-row', row)
    },
    cellClick(e, cell) {
      emit('cell-click', cell.getField(), cell.getData() as ResourceInstance)
    },
    rowSelectionChanged(selectedRowData) {
      emit('row-selection-changed', selectedRowData)
    },
    async dataLoaded() {
      try {
        const toggleCollapseElements =
          await waitForToggleCollapseElementsRendered()
        toggleCollapseElements.forEach((el) =>
          el.addEventListener('click', setTableHeight, true),
        )
      } catch (e) {
        console.error(e)
      }

      if (tabulator.value) {
        tabulator.value.rowManager.element.scrollTop = tabulatorScrollTop
      }
    },
    scrollVertical(top) {
      nextTick(() => (tabulatorScrollTop = top))
    },
    tableBuilt(this: Tabulator) {
      nextTick(() => {
        if (!this.element.parentElement) {
          console.warn('Table element does not have parentElement!')
          return
        }

        const footer = this.element.querySelector(
          '.tabulator-footer',
        ) as HTMLElement | null
        if (!footer) return
        const topFooterContainer = this.element.parentElement.querySelector(
          '.tabulator-top-pagination-placeholder',
        ) as HTMLElement
        const footerClone = footer.cloneNode(true) as HTMLElement
        const topPaginator = footerClone.querySelector(
          '.tabulator-paginator',
        ) as HTMLElement
        topPaginator.innerHTML = ''
        topFooterContainer.innerHTML = ''
        topFooterContainer.appendChild(footerClone)

        const elSelectorToMoveToTop =
          '.tabulator-paginator>label, .tabulator-paginator>.tabulator-page-size'
        footer.querySelectorAll(elSelectorToMoveToTop).forEach(function (
          this: HTMLElement,
          element,
        ) {
          ;(
            footer.querySelector('.tabulator-paginator') as HTMLElement
          ).removeChild(element)
          topPaginator.appendChild(element)
        })
      })
    },
  }

  if (props.ajaxUrl) {
    options = {
      ...options,
      ajaxURL: props.ajaxUrl,
      ajaxConfig: props.config.ajaxConfig,
      ajaxResponse: (
        _url,
        _params,
        response: ApiListResponse<ResourceInstance>,
      ) => {
        tableApiResponse.value = response as typeof tableApiResponse.value

        const page = response['hydra:view']['hydra:last']
          ? response['hydra:view']['hydra:last'].split('page=')[1]
          : 1

        totalEntryCount.value = response['hydra:totalItems']

        if (!filtersSet.value) {
          emit('set:filters', response)
          filtersSet.value = true
        }

        emit('data-loaded', response['hydra:member'])

        return { last_page: page, data: response['hydra:member'] }
      },
      ajaxError(error) {
        handleTableAjaxError(error as HTTPError, props.config.tableErrorHandler)
      },
      pageLoaded: (pageno: number) => {
        if (!tabulator.value) return
        const transformedSorters = transformSorters(
          tabulator.value.getSorters() as unknown as Sorter[],
        )
        emit(
          'page-loaded',
          pageno,
          tabulator.value.getPageSize(),
          transformedSorters
            ? { [transformedSorters.key]: transformedSorters.value }
            : null,
        )
        // to prevent not all entries showing when changing page and page size, see https://whitedigital.myjetbrains.com/youtrack/issue/ZWL-292/CMS-uznemumi-bug
        reInitTable()
      },
      ajaxSorting: true,
      ajaxRequesting(
        _url,
        params: Record<string, unknown> & { sorters: Sorter[] },
      ) {
        const sortersTransformed = transformSorters(params.sorters)

        if (sortersTransformed) {
          params[sortersTransformed.key] = sortersTransformed.value
        }

        //@ts-expect-error must be deleted although it is readonly
        delete params.sorters

        return true
      },
      ajaxLoaderLoading: `
        <div class="flex items-center justify-center" data-test="table-loading-indicator">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-32 h-32" style="margin:auto;background:0 0;display:block;shape-rendering:auto" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(30 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(60 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(90 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(120 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(150 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(180 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(210 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(240 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(270 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(300 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(330 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/></rect></svg>
        </div>`,
      pagination: 'remote',
      responsiveLayoutCollapseFormatter(data) {
        if (!data.length) return ''

        const table = document.createElement('table')
        table.classList.add('w-full')

        data.forEach((col, i) => {
          const row = document.createElement('tr')
          row.classList.add('flex', 'flex-wrap')
          if (i !== data.length - 1) {
            row.classList.add('border-b', 'border-slate-300')
          }

          const titleCell = document.createElement('td')
          const valueCell = document.createElement('td')
          titleCell.style.whiteSpace = 'initial'
          valueCell.style.whiteSpace = 'initial'
          titleCell.classList.add('basis-[20%]')
          valueCell.style.flexGrow = '4'

          col.title instanceof HTMLElement
            ? titleCell.appendChild(col.title)
            : (titleCell.innerHTML = '<strong>' + col.title + '</strong>')

          if (col.value !== null && typeof col.value !== 'undefined') {
            col.value instanceof HTMLElement
              ? valueCell.appendChild(col.value)
              : (valueCell.innerHTML = col.value ?? '')
          }

          row.appendChild(titleCell)
          row.appendChild(valueCell)

          table.appendChild(row)
        })

        return table
      },
    }
  } else if (props.columnData) {
    options = { ...options, data: props.columnData }
  }

  if (props.tabulatorOptions) {
    options = { ...options, ...props.tabulatorOptions }
  }

  if (props.config.kyInstance) {
    options = {
      ...options,
      ajaxRequestFunc(url, config, params: Record<string, string>) {
        const urlObject = new URL(url)
        Object.entries(params).forEach(([key, value]) => {
          urlObject.searchParams.append(key, value)
        })
        return props.config
          .kyInstance!.get(urlObject.href, {
            headers: config.headers,
            prefixUrl: '',
          })
          .then((response) => response.json())
      },
    }
  }

  tabulator.value = await new Tabulator(table.value, options)
}

const refreshData = () => tabulator.value.setPage(tabulator.value.getPage())

const updateData = (data: any) => {
  tabulator.value.updateOrAddData([data])
}

const getActiveRows = () => tabulator.value.rowManager.activeRows

defineExpose({
  /** Destroy and reinitialize the tabulator instance */
  reload,
  /** Directly passed to tabulator function `updateOrAddData`
   * @see https://tabulator.info/docs/4.9/update */
  updateData,
  /** Get active rows directly from tabulator */
  getActiveRows,
  /** Reload the table data (without reinitializing tabulator) */
  refreshData,
  /** The tabulator instance */
  instance: tabulator,
})
</script>

<style lang="scss">
$page-entry-count-switcher-width: 201px;

@media (min-width: 640px) {
  .table-total-entry-count {
    color: rgb(var(--color-slate-700) / var(--tw-text-opacity));
    top: 24px;
    left: calc(#{$page-entry-count-switcher-width} + 16px);
  }
}

.tabulator {
  .tabulator-header .tabulator-col {
    .tabulator-col-content {
      padding: 12px 8px !important;

      .tabulator-col-title {
        white-space: normal !important;
        text-overflow: clip !important;
      }
    }
  }

  .tabulator-headers {
    display: flex !important;
    align-items: center !important;
    width: max-content !important;
  }

  .tabulator-cell {
    padding: 12px 8px !important;
  }

  .tabulator-paginator {
    & > button {
      &:first-child {
        margin-left: auto;
      }
      &:last-child {
        margin-right: auto;
      }
    }
  }
}
</style>
