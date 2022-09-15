import { ColumnDefinition } from 'tabulator-tables'
export const createColumn = (
  colData: Partial<ColumnDefinition>
): Partial<ColumnDefinition> => ({
  hozAlign: 'left',
  headerHozAlign: 'left',
  vertAlign: 'middle',
  ...colData,
})

export const createToggleCollapseColumn = (
  colData: Partial<ColumnDefinition> = {}
): Partial<ColumnDefinition> => {
  return createColumn({
    formatter: 'responsiveCollapse',
    width: 32,
    align: 'center',
    resizable: false,
    headerSort: false,
    ...colData,
  })
}
