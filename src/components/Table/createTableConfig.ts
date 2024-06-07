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
  /**
   * Tabulator column definitions for columns displayed in the table
   * @see https://tabulator.info/docs/4.9/columns
   */
  columns: Tabulator.ColumnDefinition[]
  /**
   * Whether to show the delete action button
   */
  delete?: boolean
  /**
   * Whether to show the edit action button
   */
  edit?: boolean
  /**
   * Whether to show the view action button
   */
  view?: boolean
  /**
   * Whether to show the created at date column
   */
  created?: boolean
  /**
   * Whether to show the updated at date column
   */
  updated?: boolean
  /**
   * Tabulator ajax url for loading data into the table
   * @see https://tabulator.info/docs/4.9/data
   */
  ajaxUrl?: string | null
  /**
   * Whether to allow moving rows and show a move row marker (in actions column)
   * @see https://tabulator.info/docs/4.9/move
   */
  movableRows?: boolean
  /**
   * Whether to disable ordering by created at and updated at columns
   */
  disableOrderByDateColumns?: boolean
  /**
   * Whether to add a checkbox column for selecting rows
   * @see https://tabulator.info/docs/4.9/select
   */
  selectionColumn?: boolean
  /**
   * Label to show when hovering the row selection checkbox
   */
  selectionCheckboxLabel?: string | null
  /**
   * Static column data to display in table.
   * Alternative to using ajaxUrl, for example if data needs to be transformed before displaying in table.
   */
  columnData?: Record<string, any>[] | null
  /**
   * Tabulator paginationInitialPage parameter - the currently displayed page number.
   * @see https://tabulator.info/docs/4.9/page
   */
  page?: number
  /**
   * Tabulator paginationSize parameter - the amount of items displayed in each page.
   * @see https://tabulator.info/docs/4.9/page
   */
  pageSize?: number
  /**
   * Various table configuration options
   */
  config: TableConfig
  /**
   * Whether to show update and delete action buttons on a per-row basis
   */
  canUpdateRecordFunc?: (cell: Tabulator.CellComponent) => boolean
  /**
   * Tabulator options directly passed to the tabulator
   * @see https://tabulator.info/docs/4.9/options
   */
  tabulatorOptions?: Tabulator.Options | null
  /**
   * Custom actions to show in the action column
   */
  customActions?: CustomAction[] | null
  /**
   * Tabulator paginationSizeSelector - options for page size
   * @see https://tabulator.info/docs/4.9/page
   */
  paginationSizeSelector?: Array<number | boolean>
}
