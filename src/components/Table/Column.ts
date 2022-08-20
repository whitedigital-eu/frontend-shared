import { ColumnDefinition } from 'tabulator-tables'
export const createColumn = (
  colData: Partial<ColumnDefinition>
): Partial<ColumnDefinition> => ({
  hozAlign: 'left',
  headerHozAlign: 'left',
  vertAlign: 'middle',
  ...colData,
})
