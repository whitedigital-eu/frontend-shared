<template>
  <Modal
    class="site-tree-form-modal"
    data-test="site-tree-form-modal"
    @close="emit('close')"
  >
    <template #header>
      <h2 class="font-medium mr-auto text-base">
        {{ projectSettings.global.$t('project.createSiteTreeItem') }}
      </h2>
    </template>
    <template #body>
      <SiteTreeForm
        ref="siteTreeFormEl"
        :parent="parent"
        :project-settings="projectSettings"
        :show-parent-selector="showParentSelector"
        @success="
          (siteTree, siteTreeActive, siteTreeVisible) => {
            emit('success', siteTree, siteTreeActive, siteTreeVisible)
            emit('close')
          }
        "
      />
    </template>
    <template #footer>
      <CrudFormModalFooter
        v-if="siteTreeFormEl && siteTreeFormEl.formData"
        :is-loading="siteTreeFormEl.isLoading"
        :t="projectSettings.global.$t"
        @cancel-click="emit('close')"
        @proceed-click="siteTreeFormEl.createOrUpdate"
      />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import SiteTreeForm from './SiteTreeForm.vue'
import { SiteTreeRead } from '../Types/SiteTree'
import CrudFormModalFooter from '../../components/Modal/CrudFormModalFooter.vue'
import Modal from '../../components/Modal/Modal.vue'
import { FormData } from '../../types/FormData'
import { ProjectSettings } from '../../components/Forms/shared'

defineProps<{
  parent?: SiteTreeRead['@id'] | null
  showParentSelector?: boolean
  projectSettings: ProjectSettings
}>()

const emit = defineEmits<{
  close: []
  success: [
    siteTree: SiteTreeRead,
    siteTreeActive: boolean,
    siteTreeCreated: boolean,
  ]
}>()

const siteTreeFormEl = ref<{
  formData: Ref<FormData | null>
  createOrUpdate: () => Promise<void>
  isLoading: boolean
}>()
</script>

<style lang="scss">
.site-tree-form-modal .modal-body {
  min-height: 450px;
}
</style>
