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
