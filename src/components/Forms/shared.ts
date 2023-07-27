export type ProjectSettings = {
  global: {
    clientBaseUrl: string
    useGlobalStore: () => any
    $t: (...args: any[]) => string
    defaultLocale: string
  }
  siteTree: {
    siteTreeRepository: Record<string, (...args: any[]) => any>
    siteTreeTypeToLabel: (...args: any[]) => string
    useSiteTreeFormData: (...args: any[]) => any
  }
  form: {
    getComponent: (...args: any[]) => any
    getComponentAttributes: (...args: any[]) => any
    getEventHandlers: (...args: any[]) => any
    inputTypeToComponent: Record<string, any>
    referenceInputTypes: string[]
  }
}
