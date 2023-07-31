import { AxiosInstance } from 'axios'
import Tabulator from 'tabulator-tables'
import { CustomAction } from './ActionColumn'

type SharedColumnNames = { created: string; updated: string }

export type TableConfig = {
  sharedColumnNames: SharedColumnNames
  ajaxConfig: Tabulator.Options['ajaxConfig']
  dateTimeFormatter: (dateString: string) => string
  tableErrorHandler?: (status: number, errorData: any) => Promise<void>
  axiosInstance?: AxiosInstance
}

const createTableConfig = (config: Partial<TableConfig> = {}): TableConfig => {
  const defaultConfig = {
    sharedColumnNames: {
      created: 'created',
      updated: 'updated',
    },
    ajaxConfig: {
      headers: { Accept: 'application/ld+json' },
    },
    dateTimeFormatter: (dateString: string) => dateString,
  }

  return { ...defaultConfig, ...config }
}

export default createTableConfig

export type TableProps = {
  columns: Tabulator.ColumnDefinition[]
  delete?: boolean
  edit?: boolean
  view?: boolean
  created?: boolean
  updated?: boolean
  ajaxUrl?: string | null
  primaryField?: string
  movableRows?: boolean
  disableOrderByDateColumns?: boolean
  selectionColumn?: boolean
  selectionCheckboxLabel?: string
  columnData?: Record<string, any>[] | null
  page?: number
  pageSize?: number
  config: TableConfig
  canUpdateRecordFunc?: (cell: Tabulator.CellComponent) => boolean
  tabulatorOptions?: Tabulator.Options | null
  customActions?: CustomAction[] | null
  paginationSizeSelector?: Array<number | boolean>
}
