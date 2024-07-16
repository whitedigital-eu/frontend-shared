import { SiteTreeRead } from '../../site-tree/Types/SiteTree'
import { SelectOption } from '../../models/FormFields'
import { KyInstance } from 'ky'

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
    kyInstance: KyInstance
  }
  siteTree: {
    siteTreeRepository: {
      get: (id: string) => Promise<SiteTreeRead | undefined>
      create: (data: Record<string, any>) => Promise<SiteTreeRead | undefined>
      update: (
        iri: string,
        data: Record<string, any>,
      ) => Promise<SiteTreeRead | undefined>
      moveToPosition: (
        id: string,
        position: string,
      ) => Promise<SiteTreeRead | undefined>
    }
    siteTreeTypeToLabel: (...args: any[]) => string
    getSiteTreeTypeSelectOptions: (...args: any[]) => SelectOption<any, any>[]
    getSiteTreeSelectOptions: (
      ...args: any[]
    ) => Promise<SelectOption<string, SiteTreeRead['@id']>[]>
    siteTreeTypeToApiPath: (...args: any[]) => string | null
    siteTreeTypeToComponent: (...args: any[]) => any
  }
  form: {
    getComponent: (...args: any[]) => any
    getComponentAttributes: (...args: any[]) => any
    getEventHandlers: (...args: any[]) => any
    inputTypeToComponent: Record<string, any>
    referenceInputTypes?: string[]
  }
}
