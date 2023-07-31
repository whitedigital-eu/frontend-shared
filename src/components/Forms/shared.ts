import { SelectOptionTyped } from '../../models/FormFields'
import { SiteTreeRead } from '../../site-tree/Types/SiteTree'

export type ProjectSettings = {
  global: {
    clientBaseUrl: string
    useGlobalStore: () => Record<string, any> & {
      currentLanguageSiteTreeIri: string | null
      currentLanguageSiteTreeItem: SiteTreeRead | null
      rootSiteTrees: SiteTreeRead[] | null
      loadRootSiteTrees: () => Promise<void>
    }
    $t: (...args: any[]) => string
    defaultLocale: string
  }
  siteTree: {
    siteTreeRepository: Record<string, (...args: any[]) => any>
    siteTreeTypeToLabel: (...args: any[]) => string
    getSiteTreeTypeSelectOptions: (
      ...args: any[]
    ) => SelectOptionTyped<string, string>[]
    getSiteTreeSelectOptions: (
      ...args: any[]
    ) => Promise<SelectOptionTyped<string, SiteTreeRead['@id']>[]>
  }
  form: {
    getComponent: (...args: any[]) => any
    getComponentAttributes: (...args: any[]) => any
    getEventHandlers: (...args: any[]) => any
    inputTypeToComponent: Record<string, any>
    referenceInputTypes: string[]
  }
}
