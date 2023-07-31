<template>
  <div class="flex gap-2 items-center z-[1]">
    <FormInput
      v-if="languageSelectFormField"
      css-classes="!my-0 w-28"
      :form-field="languageSelectFormField"
      :project-settings="projectSettings"
    />
    <button
      class="btn btn-sm"
      :title="projectSettings.global.$t('admin.menu.addLocaleButtonText')"
    >
      <Icon name="Plus" @click="showNewLangModal = true" />
    </button>
  </div>
  <SiteTreeFormModal
    v-if="showNewLangModal"
    :project-settings="projectSettings"
    @close="() => (showNewLangModal = false)"
    @success="handleSiteTreeCreated"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { SelectOptionTyped, SimpleSelectFieldTS } from '../../models/FormFields'
import { SiteTreeRead } from '../Types/SiteTree'
import SiteTreeFormModal from './SiteTreeFormModal.vue'
import Icon from '../../components/Icons/Icon.vue'
import FormInput from '../../components/Forms/FormInput.vue'
import { ProjectSettings } from '../../components/Forms/shared'

const props = defineProps<{ projectSettings: ProjectSettings }>()

const router = useRouter()
const globalStore = props.projectSettings.global.useGlobalStore()

const languageSelectFormField = ref<SimpleSelectFieldTS<SiteTreeRead['@id']>>()

globalStore.loadRootSiteTrees().then(() => {
  if (!globalStore.rootSiteTrees) return

  const currentLanguageSiteTreeItem =
    globalStore.currentLanguageSiteTreeItem ??
    globalStore.rootSiteTrees.find(
      (st) => st.slug === props.projectSettings.global.defaultLocale,
    ) ??
    globalStore.rootSiteTrees[0]

  languageSelectFormField.value = new SimpleSelectFieldTS<SiteTreeRead['@id']>(
    'lang',
    '',
    currentLanguageSiteTreeItem['@id'],
    globalStore.rootSiteTrees.map(
      (st) => new SelectOptionTyped(st.slug.toUpperCase(), st['@id']),
    ),
    false,
    false,
    false,
  )
})

const showNewLangModal = ref(false)
watch(
  () => languageSelectFormField.value?.value,
  (n) => {
    if (!n || !globalStore.rootSiteTrees) return
    globalStore.currentLanguageSiteTreeIri = n
  },
)

const handleSiteTreeCreated = async (
  createdSiteTree: SiteTreeRead,
  siteTreeActive: boolean,
  siteTreeVisible: boolean,
) => {
  await globalStore.loadRootSiteTrees()

  languageSelectFormField.value!.config.options =
    globalStore.rootSiteTrees!.map(
      (st) => new SelectOptionTyped(st.slug.toUpperCase(), st['@id']),
    )
  languageSelectFormField.value!.value = createdSiteTree['@id']

  await router.push({
    name: 'SITE_TREE_CONTENT',
    params: { id: createdSiteTree.id },
    query: {
      siteTreeActive: siteTreeActive.toString(),
      siteTreeVisible: siteTreeVisible.toString(),
    },
  })
}
</script>

<style lang="scss" scoped>
:deep(.ts-control) {
  background: transparent;
}
</style>
