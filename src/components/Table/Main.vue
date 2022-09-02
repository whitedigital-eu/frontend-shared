<template>
  <div class="overflow-x-auto scrollbar-hidden relative" data-test="table">
    <div
      v-if="totalEntryCount"
      class="table-total-entry-count absolute right-4 mr-4"
      data-test="table-total-entry-count"
    >
      <span>Kopējais ierakstu skaits: </span>
      <span>{{ totalEntryCount }}</span>
    </div>
    <div
      id="tabulator"
      ref="table"
      class="mt-5 table-report table-report--tabulator"
    />
  </div>
</template>

<script setup lang="ts">
import Tabulator, { ColumnDefinition, Options } from 'tabulator-tables'
import { onMounted, ref, watch, onBeforeUnmount, PropType } from 'vue'
import { dateTimeFormatter } from '../../helpers/Global'
import translations from './translations'
import { handleTableAjaxError } from '../../helpers/Errors'
import useResponsivity from '../../composables/useResponsivity'
import createActionColumn from './ActionColumn'
import { TableConfig } from './createTableConfig'
import CellComponent = Tabulator.CellComponent
import { ApiListResponse } from '../../types/ApiPlatform'

const table = ref()
const tabulator = ref()
const totalEntryCount = ref(null)
const { isMobile } = useResponsivity()

const props = defineProps({
  columns: {
    type: Array as PropType<ColumnDefinition[]>,
    required: true,
  },
  delete: {
    default: true,
    type: Boolean,
  },
  edit: {
    default: true,
    type: Boolean,
  },
  view: {
    default: false,
    type: Boolean,
  },
  created: {
    default: true,
    type: Boolean,
  },
  updated: {
    default: true,
    type: Boolean,
  },
  ajaxUrl: {
    required: false,
    type: String,
    default: null,
  },
  primaryField: {
    default: 'name',
    type: String,
  },
  movableRows: {
    type: Boolean,
    required: false,
    default: false,
  },
  disableOrderByDateColumns: {
    type: Boolean,
    required: false,
    default: false,
  },
  selectionColumn: {
    type: Boolean,
    required: false,
    default: false,
  },
  selectionCheckboxLabel: {
    type: String,
    required: false,
    default: 'Atzīmē, lai veidotu darījumu',
  },
  columnData: {
    type: Array,
    required: false,
    default: null,
  },
  page: {
    type: Number,
    required: false,
    default: 1,
  },
  pageSize: {
    type: Number,
    required: false,
    default: 30,
  },
  pageSizeParam: {
    type: String,
    required: false,
    default: 'size',
  },
  config: {
    type: Object as PropType<TableConfig>,
    required: true,
  },
  canUpdateRecordFunc: {
    type: Function as PropType<(cell: CellComponent) => boolean>,
    required: false,
    default: () => () => true,
  },
})

const emit = defineEmits([
  'edit-click',
  'delete-click',
  'view-click',
  'move-row',
  'set:filters',
  'row-selection-changed',
  'cell-click',
  'pagination-changed',
])

const reInitTable = () => {
  tabulator.value.redraw()
}

const reInitOnResizeWindow = () => {
  window.addEventListener('resize', reInitTable)
}

onMounted(() => {
  initTabulator()
  reInitOnResizeWindow()
})

onBeforeUnmount(() => window.removeEventListener('resize', reInitTable))

watch(
  () => props.ajaxUrl,
  () => {
    reload()
  }
)

const createTimestampColumn = (
  title: string,
  field: string
): ColumnDefinition => ({
  title: title,
  field: field,
  hozAlign: 'left',
  headerHozAlign: 'left',
  width: 150,
  formatter: (cell) => dateTimeFormatter(cell.getValue()),
  headerSort: !props.disableOrderByDateColumns,
  vertAlign: 'middle',
})

const createdColumn = createTimestampColumn(
  'IZVEIDOTS',
  props.config.sharedColumnNames.created
)
const updatedColumn = createTimestampColumn(
  'ATJAUNOTS',
  props.config.sharedColumnNames.updated
)

const actionColumn = createActionColumn(
  props,
  {
    edit: (resource) => emit('edit-click', resource),
    delete: (resource) => emit('delete-click', resource),
    view: (resource) => emit('view-click', resource),
  },
  props.canUpdateRecordFunc
)

const selectionColumn: ColumnDefinition = {
  title: '',
  formatter: 'rowSelection',
  titleFormatter: 'rowSelection',
  hozAlign: 'left',
  headerHozAlign: 'left',
  headerSort: false,
  width: 40,
  cellClick: function (e, cell) {
    cell.getRow().toggleSelect()
  },
  tooltip: props.selectionCheckboxLabel,
  headerTooltip: 'Atzīmēt visu',
  vertAlign: 'middle',
}

const columnsBefore: ColumnDefinition[] = []
const columnsAfter: ColumnDefinition[] = []

if (props.selectionColumn) {
  columnsBefore.push(selectionColumn)
}

if (props.created) {
  columnsAfter.push(createdColumn)
}

if (props.updated) {
  columnsAfter.push(updatedColumn)
}

if (props.view || props.edit || props.delete) {
  columnsAfter.push(actionColumn)
}

let columns = [...columnsBefore, ...props.columns, ...columnsAfter]

const filtersSet = ref(false)

const initTabulator = async (resetPage = false) => {
  let options: Options = {
    paginationSizeSelector: [10, 30, 100],
    paginationInitialPage: resetPage ? 1 : props.page,
    paginationSize: props.pageSize,
    paginationDataSent: {
      size: props.pageSizeParam,
    },
    layout: 'fitColumns',
    headerSort: true,
    placeholder: 'Netika atrasti dati',
    locale: 'lv',
    langs: translations,
    columns,
    movableRows: props.movableRows,
    rowMoved: function (row) {
      emit('move-row', row)
    },
    cellClick: function (e, cell) {
      emit('cell-click', cell.getField(), cell.getData())
    },
    rowSelectionChanged(selectedRowData) {
      emit('row-selection-changed', selectedRowData)
    },
    maxHeight: isMobile.value ? 450 : 700,
  }

  if (props.ajaxUrl) {
    options = {
      ...options,
      ajaxURL: props.ajaxUrl,
      ajaxConfig: props.config.ajaxConfig,
      ajaxResponse: (url, params, response: ApiListResponse) => {
        const page = response['hydra:view']['hydra:last']
          ? response['hydra:view']['hydra:last'].split('page=')[1]
          : 1

        totalEntryCount.value = response['hydra:totalItems']

        if (!filtersSet.value) {
          emit('set:filters', response)
          filtersSet.value = true
        }
        return {
          last_page: page,
          data: response['hydra:member'],
        }
      },
      ajaxError: handleTableAjaxError,
      pageLoaded: (pageno: number) => {
        if (!tabulator.value) return
        emit('pagination-changed', pageno, tabulator.value.getPageSize())
      },
      ajaxSorting: true,
      ajaxRequesting: function (url, params) {
        if (params.sorters.length > 0) {
          params[`order[${params.sorters[0]['field']}]`] =
            params.sorters[0]['dir']
        }
        delete params.sorters
        return params
      },
      ajaxLoaderLoading: `
        <div class="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-32 h-32" style="margin:auto;background:0 0;display:block;shape-rendering:auto" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(30 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(60 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(90 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(120 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(150 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(180 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(210 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(240 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(270 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(300 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1e40af" transform="rotate(330 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/></rect></svg>
        </div>`,
      pagination: 'remote',
    }
  } else if (props.columnData) {
    options = {
      ...options,
      data: props.columnData,
    }
  }

  tabulator.value = await new Tabulator(table.value, options)
}

const reload = () => {
  tabulator.value.destroy()
  initTabulator(true)
}

const refreshData = () => tabulator.value.setPage(tabulator.value.getPage())

const updateData = (data: any) => {
  tabulator.value.updateOrAddData([data])
}

const getActiveRows = () => tabulator.value.rowManager.activeRows

defineExpose({
  reload,
  updateData,
  getActiveRows,
  refreshData,
})
</script>

<style lang="scss">
.table-total-entry-count {
  color: rgb(var(--color-slate-700) / var(--tw-text-opacity));
  top: -4px;
}

.tabulator {
  .tabulator-header .tabulator-col {
    .tabulator-col-content {
      padding: 12px 8px !important;

      .tabulator-col-title {
        white-space: normal;
        text-overflow: clip;
      }
    }
  }

  .tabulator-headers {
    display: flex;
    align-items: center;
    width: max-content;
  }

  .tabulator-cell {
    padding: 12px 8px !important;
  }

  .tabulator-paginator {
    padding: 4px 0 8px 0;
  }
}
</style>
