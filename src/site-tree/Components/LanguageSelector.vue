<template>
  <div class="flex gap-2 items-center z-[1]" v-bind="$attrs">
    <span class="text-lg uppercase whitespace-nowrap">
      {{ projectSettings.global.$t('project.siteTree') }}:
    </span>
    <FormInput
      v-if="languageSelectFormField && globalStore.rootSiteTrees?.length"
      css-classes="!my-0 w-28"
      :form-field="languageSelectFormField"
      :project-settings="projectSettings"
    />
    <em v-else>
      {{ projectSettings.global.$t('project.menu.noLocalesAddedText') }}
    </em>
    <button
      class="btn btn-sm"
      :title="projectSettings.global.$t('project.menu.addLocaleButtonText')"
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
import { SelectOption, SimpleSelectField } from '../../models/FormFields'
import { SiteTreeRead } from '../Types/SiteTree'
import SiteTreeFormModal from './SiteTreeFormModal.vue'
import Icon from '../../components/Icons/Icon.vue'
import FormInput from '../../components/Forms/FormInput.vue'
import { ProjectSettings } from '../../components/Forms/shared'

const props = defineProps<{ projectSettings: ProjectSettings }>()

const router = useRouter()
const globalStore = props.projectSettings.global.useGlobalStore()

const languageSelectFormField = ref<SimpleSelectField<SiteTreeRead['@id']>>()

globalStore.loadRootSiteTrees().then(() => {
  if (!globalStore.rootSiteTrees) return

  const currentLanguageSiteTreeItem =
    globalStore.currentLanguageSiteTreeItem ??
    globalStore.rootSiteTrees.find(
      (st) => st.slug === props.projectSettings.global.defaultLocale,
    ) ??
    globalStore.rootSiteTrees[0]

  languageSelectFormField.value = new SimpleSelectField<SiteTreeRead['@id']>(
    'lang',
    '',
    currentLanguageSiteTreeItem?.['@id'] ?? '',
    {
      tomSelectSettings: {
        options: globalStore.rootSiteTrees.map(
          (st) => new SelectOption(st.slug.toUpperCase(), st['@id']),
        ),
      },
      allowDelete: false,
    },
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
  if (!languageSelectFormField.value) return

  await globalStore.loadRootSiteTrees()

  languageSelectFormField.value.setOptions(
    globalStore.rootSiteTrees!.map(
      (st) => new SelectOption(st.slug.toUpperCase(), st['@id']),
    ),
  )

  languageSelectFormField.value.value = createdSiteTree['@id']

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
