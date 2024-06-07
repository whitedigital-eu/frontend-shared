export const COLLAPSE_ORDER = { never: 0, first: 1, second: 2 }

export const createColumn = (
  colData: Tabulator.ColumnDefinition,
): Tabulator.ColumnDefinition => ({
  hozAlign: 'left',
  headerHozAlign: 'left',
  vertAlign: 'top',
  responsive: COLLAPSE_ORDER.second,
  ...colData,
})

export const createToggleCollapseColumn = (
  colData: Partial<Tabulator.ColumnDefinition> = {},
): Tabulator.ColumnDefinition => {
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
