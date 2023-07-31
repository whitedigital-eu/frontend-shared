import SiteTreeFactory from '../SiteTreeFactory'
import SiteTreeNode from '../SiteTreeNode'
import { SiteTreeRead, SiteTreeType } from '../../Types/SiteTree'
import { VITE_CLIENT_BASE_URL } from 'goldwork-serviss/constants'

describe('SiteTreeFactory', () => {
  let siteTreeRead: SiteTreeRead

  beforeEach(() => {
    siteTreeRead = {
      '@context': 'context',
      id: 1,
      '@type': 'site_tree',
      createdAt: '2023-01-01T00:00:00+00:00',
      updatedAt: '2023-01-01T00:00:00+00:00',
      '@id': '/api/site_trees/1',
      title: 'Root Node',
      slug: 'root-node',
      type: SiteTreeType.html,
      isActive: true,
      isVisible: true,
      metaTitle: 'Root Meta Title',
      metaDescription: 'Root Meta Description',
      root: undefined,
      parent: undefined,
      level: 0,
      left: 0,
      children: [
        {
          '@id': '/api/site_trees/2',
          title: 'Child Node One',
          slug: 'child-node-1',
          type: SiteTreeType.html,
          isActive: true,
          isVisible: true,
          metaTitle: 'Child Meta Title',
          metaDescription: 'Child Meta Description',
          root: undefined,
          parent: undefined,
          children: [],
          level: 1,
          left: 0,

          '@context': 'context',
          id: 2,
          '@type': 'site_tree',
          createdAt: '2023-01-01T00:00:00+00:00',
          updatedAt: '2023-01-01T00:00:00+00:00',
        },
        {
          '@id': '/api/site_trees/3',
          title: 'Child Node Two',
          slug: 'child-node-2',
          type: SiteTreeType.html,
          isActive: true,
          isVisible: true,
          metaTitle: 'Child Meta Title 2',
          metaDescription: 'Child Meta Description 2',
          root: undefined,
          parent: undefined,
          children: [],
          level: 1,
          left: 0,

          '@context': 'context',
          id: 3,
          '@type': 'site_tree',
          createdAt: '2023-01-01T00:00:00+00:00',
          updatedAt: '2023-01-01T00:00:00+00:00',
        },
      ],
    }
  })

  it('should construct a tree correctly', () => {
    const rootNode = SiteTreeFactory.constructTree(
      siteTreeRead,
      VITE_CLIENT_BASE_URL
    )

    expect(rootNode instanceof SiteTreeNode).toBe(true)
    expect(rootNode.title).toBe('Root Node')
    expect(rootNode.children.length).toBe(2)

    const childNodeOne = rootNode.children[0]
    expect(childNodeOne instanceof SiteTreeNode).toBe(true)
    expect(childNodeOne.title).toBe('Child Node One')
    expect(childNodeOne.slug).toBe('child-node-1')
    expect(childNodeOne.parent).toBe(rootNode)

    const childNodeTwo = rootNode.children[1]
    expect(childNodeTwo instanceof SiteTreeNode).toBe(true)
    expect(childNodeTwo.title).toBe('Child Node Two')
    expect(childNodeTwo.slug).toBe('child-node-2')
    expect(childNodeTwo.parent).toBe(rootNode)
  })
})
