import { AxiosInstance } from 'axios'

type SharedColumnNames = {
  created: string
  updated: string
}

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
