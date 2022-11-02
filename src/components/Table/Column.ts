import { ColumnDefinition } from 'tabulator-tables'

export const COLLAPSE_ORDER = {
  never: 0,
  first: 1,
  second: 2,
}

export const createColumn = (colData: ColumnDefinition): ColumnDefinition => ({
  hozAlign: 'left',
  headerHozAlign: 'left',
  vertAlign: 'top',
  responsive: COLLAPSE_ORDER.second,
  ...colData,
})

export const createToggleCollapseColumn = (
  colData: Partial<ColumnDefinition> = {}
): ColumnDefinition => {
  return createColumn({
    title: '',
    formatter: 'responsiveCollapse',
    width: 24,
    maxWidth: 24,
    minWidth: 24,
    resizable: false,
    headerSort: false,
    vertAlign: 'middle',
    ...colData,
  })
}
