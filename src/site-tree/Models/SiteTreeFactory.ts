import { SiteTreeRead } from '../Types/SiteTree'
import SiteTreeNode from './SiteTreeNode'

export default class SiteTreeFactory {
  private static addChildren(
    st: SiteTreeRead,
    node: SiteTreeNode,
  ): SiteTreeNode {
    for (const childSt of st.children) {
      const childNode = new SiteTreeNode(
        childSt.id,
        childSt['@id'],
        childSt.title,
        childSt.slug,
        childSt.type,
        childSt.isActive,
        childSt.isVisible,
        childSt.metaTitle,
        childSt.metaDescription,
      )
      this.addChildren(childSt, childNode)
      node.addChild(childNode)
    }

    return node
  }

  static constructTree(st: SiteTreeRead, baseUrl: string) {
    const node = new SiteTreeNode(
      st.id,
      st['@id'],
      st.title,
      st.slug,
      st.type,
      st.isActive,
      st.isVisible,
      st.metaTitle,
      st.metaDescription,
      null,
      baseUrl,
    )
    return this.addChildren(st, node)
  }
}
