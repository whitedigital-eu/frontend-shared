import { Modify, NotNullableOptional, NullableOptional } from './Shared'

export type SiteTreeWrite = NullableOptional<{
  root: SiteTreeRead['@id']
  parent: SiteTreeRead['@id']
  children: SiteTreeRead['@id'][]
  type: string
  isActive: boolean
  isVisible: boolean
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
}>

export type SiteTreeRead = {
  '@context': string
  '@id': `/api/site_trees/${number}`
  '@type': string
  id: number
  createdAt: string
  updatedAt: string
} & Modify<
  NotNullableOptional<SiteTreeWrite>,
  {
    title: string
    slug: string
    type: string
    root: undefined
    parent: never
    children: SiteTreeRead[]
    isActive: boolean
    isVisible: boolean
  }
> & {
    level: number
    left: number
  }
