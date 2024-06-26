import { SiteTreeRead } from '../../site-tree/Types/SiteTree'
import { AxiosRequestConfig } from 'axios'
import { SelectOption } from '../../models/FormFields'

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
    siteTreeRepository: {
      get: (
        iriOrId: string | number,
        config?: AxiosRequestConfig,
      ) => Promise<SiteTreeRead>
      create: (
        data: Record<string, any>,
        config?: AxiosRequestConfig,
      ) => Promise<SiteTreeRead>
      update: (
        iriOrId: string | number,
        data: Record<string, any>,
        config?: AxiosRequestConfig,
      ) => Promise<SiteTreeRead>
      delete: (iriOrId: string | number) => Promise<void>
      createOrUpdate: (
        iriOrId: string | number | null | undefined,
        data: Record<string, any>,
        config?: AxiosRequestConfig,
      ) => Promise<SiteTreeRead>
      moveToPosition: (
        iriOrId: string | number,
        position: number,
        config?: AxiosRequestConfig,
      ) => Promise<SiteTreeRead>
    }
    siteTreeTypeToLabel: (...args: any[]) => string
    getSiteTreeTypeSelectOptions: (...args: any[]) => SelectOption<any, any>[]
    getSiteTreeSelectOptions: (
      ...args: any[]
    ) => Promise<SelectOption<string, SiteTreeRead['@id']>[]>
    siteTreeTypeToRepository: (...args: any[]) => {
      list: (...args: any[]) => Promise<any>
    } | null
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
