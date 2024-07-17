export type SiteTreeWrite = {
  root: SiteTreeRead['@id'] | SiteTreeRead
  level: number
  parent?: SiteTreeRead['@id'] | SiteTreeRead
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  type: string
  /** @example [
   *       "/api/site_trees/1"
   *     ] */
  children: unknown
}

export type SiteTreeRead = {
  /** @example /api/site_trees/1 */
  readonly '@id': '/api/site_trees/{id}'
  id: number
  root: SiteTreeRead['@id']
  level: number
  left: number
  isActive: boolean
  isVisible: boolean
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  type: string
  /** @example [
   *       "/api/site_trees/1"
   *     ] */
  children: unknown
  /** Format: date-time */
  createdAt?: string | null
  /** Format: date-time */
  updatedAt?: string | null
}
