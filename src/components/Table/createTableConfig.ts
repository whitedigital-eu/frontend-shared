import { Options } from 'tabulator-tables'

type SharedColumnNames = {
  created: string
  updated: string
}

export type TableConfig = {
  sharedColumnNames: SharedColumnNames
  ajaxConfig: typeof Options['ajaxConfig']
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
  }

  return { ...defaultConfig, ...config }
}

export default createTableConfig
