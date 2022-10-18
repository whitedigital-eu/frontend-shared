import { DataFetchingSelectConfig, SimpleSelectConfig } from './InputFields'

export class Filter {
  constructor(
    public label: string,
    public name: string,
    public type = 'text',
    public config: SimpleSelectConfig | DataFetchingSelectConfig | null = null,
    public value: string | string[] = '',
    public toggleExact = false,
    public exact = false,
    public description: string | null = null
  ) {}
}

export type Filters = {
  default: Filter[]
  advanced: Filter[]
}
