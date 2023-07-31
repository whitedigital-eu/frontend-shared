import { SiteTreeRead } from '../Types/SiteTree'

export default class SiteTreeNode {
  id: number
  '@id': SiteTreeRead['@id']
  title: string
  slug: string
  type: string
  isActive: boolean
  isVisible: boolean
  metaTitle?: string
  metaDescription?: string
  parent: SiteTreeNode | null
  children: SiteTreeNode[]

  baseUrl: string | null = null // base url for root nodes

  constructor(
    id: number,
    iri: SiteTreeRead['@id'],
    title: string,
    slug: string,
    type: string,
    isActive: boolean,
    isVisible: boolean,
    metaTitle: string | undefined,
    metaDescription: string | undefined,
    parent: SiteTreeNode | null = null,
    baseUrl: string | null = null,
  ) {
    this.id = id
    this['@id'] = iri
    this.title = title
    this.slug = slug
    this.type = type
    this.isActive = isActive
    this.isVisible = isVisible
    this.metaTitle = metaTitle
    this.metaDescription = metaDescription
    this.parent = parent
    this.children = []
    this.baseUrl = baseUrl
  }

  addChild(node: SiteTreeNode): void {
    node.parent = this
    this.children.push(node)
  }

  removeChild(node: SiteTreeNode): void {
    const index = this.children.indexOf(node)
    if (index > -1) {
      this.children.splice(index, 1)
    }
  }

  findNode(iri: string): SiteTreeNode | null {
    if (this['@id'] === iri) {
      return this
    }
    for (const child of this.children) {
      const result = child.findNode(iri)
      if (result) return result
    }
    return null
  }

  get path(): string {
    if (this.parent) {
      return `${this.parent.path}/${this.slug}`
    }
    if (!this.baseUrl) {
      throw new Error('SiteTreeNode.baseUrl is not set')
    }
    return `${this.baseUrl}/${this.slug}`
  }
}
