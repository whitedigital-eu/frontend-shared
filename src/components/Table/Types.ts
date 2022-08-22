import {
  DataFetchingSelectConfig,
  SimpleSelectConfig,
} from '../../types/InputFields'

export type HydraMapping = {
  property: string
  required: boolean
  variable: string
}
export type ApiListResponse = {
  'hydra:search'?: {
    'hydra:mapping'?: HydraMapping[]
  }
}

export class Filter {
  constructor(
    public label,
    public name,
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
