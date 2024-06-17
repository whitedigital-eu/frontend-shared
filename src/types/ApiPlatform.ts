export type HydraMapping = {
  property: string
  required: boolean
  variable: string
}

export type ApiListResponse<ResourceInstance extends Record<string, unknown>> =
  {
    'hydra:meta'?: Record<string, unknown>
    'hydra:search'?: { 'hydra:mapping'?: HydraMapping[] }
    'hydra:view': {
      'hydra:first'?: string
      'hydra:last'?: string
      'hydra:next'?: string
    }
    'hydra:totalItems': number
    'hydra:member': ResourceInstance[]
  }
