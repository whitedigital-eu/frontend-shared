export type AccordionLayout = {
  title: string
  layout: Array<Array<string>>
  tables: any[]
  order?: number
  cols?: 1 | 2 | 3 | 4 | 5
}

export type ModalSize = 'sm' | 'lg' | 'xl' | 'full' | 'fit' | 'cover' | null

export type GridFormCols = 1 | 2 | 3 | 4 | 5
