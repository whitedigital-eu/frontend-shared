<template>
  <div class="box md:p-4 p-2">
    <component
      :is="componentToRender"
      v-if="siteTreeItem && contentTypeItemLoaded"
      :content-type-item="contentTypeItem"
      :site-tree-active="siteTreeActive"
      :site-tree-item="siteTreeItem"
      :site-tree-visible="siteTreeVisible"
      @click:save="updateSiteTreeItem"
    >
      <template #default="{ isLoading, createOrUpdate }">
        <div v-if="siteTreeForm" class="flex gap-4 items-center justify-end">
          <FormInput
            :form-field="siteTreeForm.siteTreeActive"
            :project-settings="projectSettings"
          />
          <FormInput
            :form-field="siteTreeForm.siteTreeVisible"
            :project-settings="projectSettings"
          />
          <button
            class="btn btn-primary"
            :disabled="isLoading || loadingState"
            @click="createOrUpdate"
          >
            <Icon class="mr-3" name="Save" size="15" />
            <span>
              {{ projectSettings.global.$t('form.common.save') }}
            </span>
          </button>
          <button
            class="btn btn-primary"
            :disabled="isLoading || loadingState"
            @click="
              () => {
                createOrUpdate().then(() => router.back())
              }
            "
          >
            <Icon class="mr-3" name="Save" size="15" />
            <span>
              {{ projectSettings.global.$t('form.common.saveAndClose') }}
            </span>
          </button>
        </div>
      </template>
    </component>
    <Loader v-else />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { SiteTreeRead } from '../Types/SiteTree'
import { ProjectSettings } from '../../components/Forms/shared'
import Loader from '../../components/Loader.vue'
import Icon from '../../components/Icons/Icon.vue'
import FormInput from '../../components/Forms/FormInput.vue'
import { CheckboxField } from '../../models/FormFields'
import { useRouter } from 'vue-router'

const props = defineProps<{
  id: number
  siteTreeActive?: boolean
  siteTreeVisible?: boolean
  projectSettings: ProjectSettings
}>()

const router = useRouter()

const siteTreeItem = ref<SiteTreeRead | null>(null)
const contentTypeItem = ref<Record<string, unknown> | null>(null)
const contentTypeItemLoaded = ref(false)
const loadingState = ref(false)

const siteTreeContentRepository = computed(() => {
  if (!siteTreeItem.value) return null
  return props.projectSettings.siteTree.siteTreeTypeToRepository(
    siteTreeItem.value.type,
  )
})

const componentToRender = computed<any>(() => {
  if (!siteTreeItem.value) return null
  return props.projectSettings.siteTree.siteTreeTypeToComponent(
    siteTreeItem.value.type,
  )
})

const loadData = async () => {
  try {
    siteTreeItem.value =
      await props.projectSettings.siteTree.siteTreeRepository.get(props.id)

    if (!siteTreeContentRepository.value) {
      throw new Error('Repository not found')
    }
    const matchingContentTypeItems = await siteTreeContentRepository.value.list(
      { params: { 'node.id': siteTreeItem.value.id } },
    )
    contentTypeItem.value = matchingContentTypeItems.length
      ? matchingContentTypeItems[0]
      : null
  } catch (e) {
    console.error(e)
  } finally {
    contentTypeItemLoaded.value = true
  }
}

loadData()

const siteTreeForm = computed(() => {
  if (!siteTreeItem.value || !contentTypeItemLoaded.value) return null
  return {
    siteTreeActive: new CheckboxField(
      'siteTreeActive',
      'Active',
      contentTypeItem.value
        ? siteTreeItem.value.isActive
        : props.siteTreeActive,
    ),
    siteTreeVisible: new CheckboxField(
      'siteTreeVisible',
      'Visible',
      contentTypeItem.value
        ? siteTreeItem.value.isVisible
        : props.siteTreeVisible,
    ),
  }
})

const updateSiteTreeItem = async () => {
  try {
    loadingState.value = true
    if (siteTreeItem.value) {
      await props.projectSettings.siteTree.siteTreeRepository.update(
        siteTreeItem.value.id,
        {
          isActive: siteTreeForm.value?.siteTreeActive.value,
          isVisible: siteTreeForm.value?.siteTreeVisible.value,
        },
      )
    }
  } finally {
    loadingState.value = false
  }
}
</script>
