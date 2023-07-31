import SiteTreeNode from '../SiteTreeNode'
import { SiteTreeType } from '../../Types/SiteTree'

describe('SiteTreeNode', () => {
  let rootNode: SiteTreeNode

  beforeEach(() => {
    rootNode = new SiteTreeNode(
      1,
      '/api/site-tree/1',
      'Root Node',
      'root-node',
      SiteTreeType.html,
      true,
      true,
      'Root Meta Title',
      'Root Meta Description',
      null
    )
    rootNode.baseUrl = 'https://www.example.com/'
  })

  it('should initialize correctly', () => {
    expect(rootNode.title).toBe('Root Node')
    expect(rootNode.slug).toBe('root-node')
    expect(rootNode.type).toBe(SiteTreeType.html)
    expect(rootNode.isActive).toBe(true)
    expect(rootNode.isVisible).toBe(true)
    expect(rootNode.metaTitle).toBe('Root Meta Title')
    expect(rootNode.metaDescription).toBe('Root Meta Description')
    expect(rootNode.parent).toBeNull()
    expect(rootNode.children).toEqual([])
  })

  it('should add a child node correctly', () => {
    const childNode = new SiteTreeNode(
      2,
      '/api/site-tree/2',
      'Child Node',
      'child-node',
      SiteTreeType.html,
      true,
      true,
      'Child Meta Title',
      'Child Meta Description',
      rootNode
    )

    rootNode.addChild(childNode)

    expect(rootNode.children.length).toBe(1)
    expect(rootNode.children[0]).toBe(childNode)
    expect(childNode.parent).toBe(rootNode)
  })

  it('should remove a child node correctly', () => {
    const childNode = new SiteTreeNode(
      2,
      '/api/site-tree/2',
      'Child Node',
      'child-node',
      SiteTreeType.html,
      true,
      true,
      'Child Meta Title',
      'Child Meta Description',
      rootNode
    )

    rootNode.addChild(childNode)
    expect(rootNode.children.length).toBe(1)
    expect(childNode.path).toBe('https://www.example.com/root-node/child-node')

    rootNode.removeChild(childNode)
    expect(rootNode.children.length).toBe(0)
  })

  it('should find a node by iri correctly', () => {
    const childNode = new SiteTreeNode(
      2,
      '/api/site-tree/2',
      'Child Node',
      'child-node',
      SiteTreeType.html,
      true,
      true,
      'Child Meta Title',
      'Child Meta Description',
      rootNode
    )

    rootNode.addChild(childNode)

    const foundNode = rootNode.findNode('/api/site-tree/2')
    expect(foundNode).toBe(childNode)
  })

  it('should return the correct path', () => {
    expect(rootNode.path).toBe('https://www.example.com/root-node')
  })
})
