import SiteTreeFactory from '../SiteTreeFactory'
import SiteTreeNode from '../SiteTreeNode'
import { SiteTreeRead } from '../../Types/SiteTree'
import { mockSiteTreeRead } from '../../TestUtils/mocks'

describe('SiteTreeFactory', () => {
  let siteTreeRead: SiteTreeRead

  beforeEach(() => {
    siteTreeRead = mockSiteTreeRead
  })

  it('should construct a tree correctly', () => {
    const rootNode = SiteTreeFactory.constructTree(
      siteTreeRead,
      'www.example.com',
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
