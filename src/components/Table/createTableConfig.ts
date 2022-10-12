import { Options } from 'tabulator-tables'

type SharedColumnNames = {
  created: string
  updated: string
}

export type TableConfig = {
  sharedColumnNames: SharedColumnNames
  ajaxConfig: Options['ajaxConfig']
  dateTimeFormatter: (string) => string
  tableErrorHandler?: (status: number, errorData: any) => Promise<void>
}

const createTableConfig = (config: Partial<TableConfig> = {}): TableConfig => {
  const defaultConfig = {
    sharedColumnNames: {
      created: 'created',
      updated: 'updated',
    },
    ajaxConfig: {
      headers: {
        Accept: 'application/ld+json',
      },
    },
    dateTimeFormatter: (value) => value,
  }

  return { ...defaultConfig, ...config }
}

export default createTableConfig
