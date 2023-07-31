import { Ref, watch } from 'vue'
import slugify from 'slugify'
import { ProjectSettings } from '../../components/Forms/shared'
import {
  CheckboxField,
  SimpleSelectFieldTS,
  TextField,
} from '../../models/FormFields'
import { SiteTreeRead } from '../Types/SiteTree'
import SiteTreeNode from '../Models/SiteTreeNode'
import { fillFormDataFrom } from '../../helpers/Global'
import useFormData from '../../composables/useFormData'

export type SiteTreeFormData = {
  title: TextField
  slug: TextField
  type: SimpleSelectFieldTS<SiteTreeRead['type']>
  metaTitle: TextField
  metaDescription: TextField
  isActive: CheckboxField
  isVisible: CheckboxField
  parent?: SimpleSelectFieldTS<SiteTreeRead['@id']>
}

export default function useSiteTreeFormData(
  siteTree: SiteTreeRead | SiteTreeNode | null,
  parent: SiteTreeRead['@id'] | null,
  showParentSelector: boolean,
  projectSettings: ProjectSettings,
) {
  const typeSelectOptions =
    projectSettings.siteTree.getSiteTreeTypeSelectOptions()
  const baseFormData: SiteTreeFormData = {
    title: new TextField(
      'title',
      projectSettings.global.$t('form.table.title'),
    ),
    slug: new TextField('slug', projectSettings.global.$t('form.table.slug')),
    type: new SimpleSelectFieldTS<SiteTreeRead['type']>(
      'type',
      projectSettings.global.$t('form.table.type'),
      typeSelectOptions[0].value,
      typeSelectOptions,
      !!siteTree,
    ),
    metaTitle: new TextField(
      'metaTitle',
      projectSettings.global.$t('form.table.metaTitle'),
    ),
    metaDescription: new TextField(
      'metaDescription',
      projectSettings.global.$t('form.table.metaDescription'),
    ),
    isActive: new CheckboxField(
      'isActive',
      projectSettings.global.$t('form.table.active'),
    ),
    isVisible: new CheckboxField(
      'isVisible',
      projectSettings.global.$t('form.table.visible'),
    ),
  }

  const prepareFormData = async (formData: SiteTreeFormData) => {
    if (siteTree) {
      fillFormDataFrom(formData, siteTree)
    } else if (showParentSelector) {
      baseFormData.parent = new SimpleSelectFieldTS(
        'parent',
        'Parent section',
        parent,
        await projectSettings.siteTree.getSiteTreeSelectOptions(),
      )
    }
    return formData
  }

  const setupWatchers = (formData: Ref<SiteTreeFormData>) => {
    if (!siteTree) {
      watch(
        () => formData.value.title.value,
        (n) => {
          formData.value.slug.value = slugify(n ?? '', { lower: true })
        },
      )
    }

    watch(
      () => formData.value.slug.value,
      (n, o) => {
        if (n !== o) {
          const slugSlugified = slugify(n ?? '', { lower: true })
          if (slugSlugified.slice(-1) === (n ?? '').slice(-1)) {
            formData.value.slug.value = slugSlugified
          }
        }
      },
    )
  }

  const formLayout: Array<Array<keyof SiteTreeFormData>> = [
    [
      'title',
      'slug',
      'type',
      'metaTitle',
      'metaDescription',
      'isActive',
      'isVisible',
    ],
  ]
  if (showParentSelector) formLayout[0].unshift('parent')

  return {
    ...useFormData(baseFormData, prepareFormData, setupWatchers),
    formLayout,
  }
}
