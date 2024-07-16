import { ProjectSettings } from '../../components/Forms/shared'
import { SiteTreeRead } from '../Types/SiteTree'
import ky from 'ky'

export const mockSiteTreeRead: SiteTreeRead = {
  '@context': 'context',
  id: 1,
  '@type': 'site_tree',
  createdAt: '2023-01-01T00:00:00+00:00',
  updatedAt: '2023-01-01T00:00:00+00:00',
  '@id': '/api/site_trees/1',
  title: 'Root Node',
  slug: 'root-node',
  type: 'html',
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
      type: 'html',
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
      type: 'html',
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

export const mockProjectSettings: ProjectSettings = {
  global: {
    clientBaseUrl: 'https://mockbaseurl.com',
    useGlobalStore: () => ({
      currentLanguageSiteTreeIri: '/some/site/tree/123',
      currentLanguageSiteTreeItem: mockSiteTreeRead,
      rootSiteTrees: [mockSiteTreeRead, mockSiteTreeRead],
      loadRootSiteTrees: async () => {
        console.log('loadRootSiteTrees called')
      },
    }),
    $t: (...args: any[]) => 'Translated string',
    defaultLocale: 'en-US',
    kyInstance: ky.create({}),
  },
  siteTree: {
    siteTreeRepository: {
      get: async (id: string) =>
        new Promise((resolve) => resolve(mockSiteTreeRead)),
      create: async (data: Record<string, any>) =>
        new Promise((resolve) => resolve(mockSiteTreeRead)),
      update: async (iri: string, data: Record<string, any>) =>
        new Promise((resolve) => resolve(mockSiteTreeRead)),
      moveToPosition: async (id: string, position: string) =>
        new Promise((resolve) => resolve(mockSiteTreeRead)),
    },
    siteTreeTypeToLabel: (...args: any[]) => 'Mock Label',
    getSiteTreeTypeSelectOptions: (...args: any[]) => [
      {
        text: 'HTML',
        value: 'html',
      },
      {
        text: 'Redirect',
        value: 'redirect',
      },
    ],
    getSiteTreeSelectOptions: async (...args: any[]) => [
      {
        text: 'Option A',
        value: mockSiteTreeRead['@id'],
      },
      {
        text: 'Option B',
        value: mockSiteTreeRead['@id'],
      },
    ],
    siteTreeTypeToApiPath: (...args: any[]) => '/api/htmls',
    siteTreeTypeToComponent: (...args: any[]) => ({
      componentName: 'MockComponent',
    }),
  },
  form: {
    getComponent: (...args: any[]) => ({ componentName: 'FormComponent' }),
    getComponentAttributes: (...args: any[]) => ({
      attribute: 'mockAttribute',
    }),
    getEventHandlers: (...args: any[]) => ({ handler: () => {} }),
    inputTypeToComponent: {
      text: 'TextInputComponent',
      number: 'NumberInputComponent',
    },
    referenceInputTypes: ['refType1', 'refType2'],
  },
}
