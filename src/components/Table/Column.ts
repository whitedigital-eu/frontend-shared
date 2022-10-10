import { ColumnDefinition } from 'tabulator-tables'
export const createColumn = (colData: ColumnDefinition): ColumnDefinition => ({
  hozAlign: 'left',
  headerHozAlign: 'left',
  vertAlign: 'top',
  ...colData,
})

export const createToggleCollapseColumn = (
  colData: ColumnDefinition = { title: '' }
): ColumnDefinition => {
  return createColumn({
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
