<template>
  <form class="mb-4" @submit.prevent="createOrUpdate">
    <GridForm
      v-if="formData"
      :cols="1"
      :form-data="formData"
      :form-layout="formLayout"
      :project-settings="projectSettings"
    />
    <Loader v-else />
  </form>
  <slot
    :create-or-update="createOrUpdate"
    :form-data="formData"
    :is-loading="isLoading"
  ></slot>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Loader from '../../components/Loader.vue'
import GridForm from '../../components/Forms/GridForm.vue'
import SiteTreeNode from '../Models/SiteTreeNode'
import { setFormDataErrors } from '../../helpers/Errors'
import { SiteTreeRead, SiteTreeWrite } from '../Types/SiteTree'
import { getFormFieldValues } from '../../helpers/Global'
import { ProjectSettings } from '../../components/Forms/shared'
import useSiteTreeFormData from './useSiteTreeFormData'

const {
  siteTree = null,
  parent = null,
  showParentSelector,
  projectSettings,
} = defineProps<{
  siteTree?: SiteTreeRead | SiteTreeNode | null
  parent?: SiteTreeRead['@id'] | null
  showParentSelector?: boolean
  projectSettings: ProjectSettings
}>()

const emit = defineEmits<{
  success: [
    siteTree: SiteTreeRead,
    siteTreeActive: boolean,
    siteTreeCreated: boolean,
  ]
  finished: []
}>()

const { formData, formLayout } = useSiteTreeFormData(
  siteTree,
  parent,
  showParentSelector,
  projectSettings,
)

const isLoading = ref(false)
const internalSiteTree = ref<typeof siteTree | undefined>(siteTree)

const createOrUpdate = async () => {
  if (!formData.value) {
    console.error(
      `formData.value must be truthy when submitting form! formData.value: ${formData.value}`,
    )
    return
  }

  isLoading.value = true

  const data: Partial<SiteTreeWrite> = getFormFieldValues(
    formData.value,
    projectSettings.form.referenceInputTypes,
  ) as any
  if (!internalSiteTree.value && !showParentSelector && parent) {
    data.parent = parent
  }
  if (!internalSiteTree.value) {
    //@ts-ignore
    delete data.isVisible
    //@ts-ignore
    delete data.isActive
  }
  if (internalSiteTree.value) {
    for (const key of Object.keys(data)) {
      if (
        key in internalSiteTree.value &&
        internalSiteTree.value[key as keyof typeof internalSiteTree.value] ===
          data[key as keyof typeof data]
      ) {
        delete data[key as keyof typeof data]
      }
    }
  }

  try {
    internalSiteTree.value = await (internalSiteTree.value?.['@id']
      ? projectSettings.siteTree.siteTreeRepository.update(
          internalSiteTree.value['@id'],
          data,
        )
      : projectSettings.siteTree.siteTreeRepository.create(data))
    emit(
      'success',
      internalSiteTree.value as SiteTreeRead,
      formData.value.isActive.value,
      formData.value.isVisible.value,
    )
  } catch (e: any) {
    await setFormDataErrors(e, formData.value)
  } finally {
    isLoading.value = false
    emit('finished')
  }
}

defineExpose({ formData, createOrUpdate, isLoading })
</script>
