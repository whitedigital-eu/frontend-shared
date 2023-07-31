<template>
  <main class="mt-4">
    <div class="flex flex-1 gap-5">
      <div class="site-tree-list">
        <div>
          <div class="flex items-end justify-between mb-5">
            <h1 class="text-2xl">
              {{ projectSettings.global.$t('admin.siteTree.siteTree') }}
            </h1>
            <div>
              <!-- TODO: implement -->
              <!--              <button-->
              <!--                class="border-0 btn mr-4 p-0 text-slate-500"-->
              <!--                @click="expandTree"-->
              <!--              >-->
              <!--                <Icon class="mr-2" name="ChevronsUpDown" size="14" />-->
              <!--                <span>Expand all</span>-->
              <!--              </button>-->
              <!--              <button-->
              <!--                class="border-0 btn p-0 text-slate-500"-->
              <!--                @click="collapseTree"-->
              <!--              >-->
              <!--                <Icon class="mr-2" name="ChevronsDownUp" size="14" />-->
              <!--                <span>Collapse all</span>-->
              <!--              </button>-->
            </div>
          </div>
          <ul v-if="globalStore.currentLanguageSiteTreeItem">
            <template v-if="baseSiteTreeModel.length">
              <Draggable
                v-model="baseSiteTreeModel"
                :indent="24"
                virtualization
                @dragend="handleDragEnd"
              >
                <template
                  #default="{
                    node,
                    stat,
                  }: {
                    node: SiteTreeNode
                    stat: {
                      children: SiteTreeNode[]
                      open: boolean
                      parent?: { data: SiteTreeNode }
                    }
                  }"
                >
                  <SiteTreeItem
                    :has-children="!!stat.children.length"
                    :is-open="stat.open"
                    :is-selected="siteTreeToEdit?.['@id'] === node['@id']"
                    :node="node"
                    :project-settings="projectSettings"
                    @click:add="siteTreeInitialParent = node"
                    @click:delete="siteTreeToDelete = node"
                    @click:duplicate="() => duplicateSiteTree(node, stat)"
                    @click:edit="
                      () => {
                        siteTreeToEdit = null
                        nextTick(() => (siteTreeToEdit = node))
                      }
                    "
                    @click:toggle-open="stat.open = !stat.open"
                  />
                </template>
              </Draggable>
            </template>
            <p v-else>No sections added yet!</p>
          </ul>
          <Loader v-else />
        </div>
      </div>
      <div class="basis-[360px]">
        <div class="flex gap-3 items-center justify-end min-h-[50px]">
          <button
            v-if="currentLangSiteTree"
            class="btn btn-primary mb-2 mt-2 py-1"
            @click="siteTreeInitialParent = currentLangSiteTree"
          >
            <Icon name="Plus" />
            <span>{{
              projectSettings.global.$t('admin.siteTree.newSection')
            }}</span>
          </button>
        </div>
        <div class="box p-5">
          <template v-if="siteTreeToEdit">
            <p class="flex items-center justify-between">
              <span class="text-base">
                {{
                  projectSettings.global.$t(
                    'admin.siteTree.editSectionSettings',
                  )
                }}
              </span>
              <button
                v-if="isClipboardSupported"
                class="border-0 btn p-0 text-slate-500"
                @click="copyNodePathToClipboard(siteTreeToEdit)"
              >
                <Icon class="mr-2" name="Clipboard" size="14" />
                <span>Copy link</span>
              </button>
            </p>
            <div class="border-b border-slate-200 my-2"></div>
            <SiteTreeForm
              :key="siteTreeFormKey"
              v-slot="{ createOrUpdate, isLoading }"
              :project-settings="projectSettings"
              :site-tree="siteTreeToEdit"
              @finished="loadSiteTree"
            >
              <div class="flex gap-2">
                <button
                  class="btn btn-outline-secondary grow"
                  :disabled="isLoading"
                  @click="siteTreeFormKey++"
                >
                  <Icon class="mr-2" name="X" size="15" />
                  <span>{{
                    projectSettings.global.$t('form.common.cancelChanges')
                  }}</span>
                </button>
                <button
                  class="btn btn-primary grow"
                  :disabled="isLoading"
                  @click="createOrUpdate"
                >
                  <Icon class="mr-2" name="Save" size="15" />
                  <span>{{
                    projectSettings.global.$t('form.common.saveChanged')
                  }}</span>
                </button>
              </div>
            </SiteTreeForm>
          </template>
          <div v-else class="my-44 text-center w-full">
            <span
              >{{ projectSettings.global.$t('admin.siteTree.clickOneThe') }}
            </span>
            <button class="btn btn-primary p-[2px] rounded-xs">
              <Icon name="Settings" size="10" />
            </button>
            <span>
              {{
                projectSettings.global.$t('admin.siteTree.buttonToEditASection')
              }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </main>
  <SiteTreeFormModal
    v-if="siteTreeInitialParent"
    :parent="
      siteTreeInitialParent
        ? (siteTreeInitialParent as SiteTreeRead)['@id']
        : null
    "
    :project-settings="projectSettings"
    :show-parent-selector="(siteTreeInitialParent as SiteTreeRead)?.level > 0"
    @close="() => (siteTreeInitialParent = null)"
    @success="handleSiteTreeCreated"
  />
  <ConfirmationModal
    v-if="siteTreeToDelete"
    :title="siteTreeToDelete.title"
    @close="siteTreeToDelete = null"
    @confirm="onDeletionConfirmed"
  />
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { Draggable, walkTreeData } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import SiteTreeItem from './SiteTreeItem.vue'
import { useClipboard } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { showSuccessMessage } from '../../helpers/FlashMessages'
import SiteTreeNode from '../Models/SiteTreeNode'
import SiteTreeFactory from '../Models/SiteTreeFactory'
import { createRandomNumber } from '../../helpers/Global'
import Icon from '../../components/Icons/Icon.vue'
import Loader from '../../components/Loader.vue'
import { SiteTreeRead, SiteTreeWrite } from '../Types/SiteTree'
import SiteTreeFormModal from './SiteTreeFormModal.vue'
import SiteTreeForm from './SiteTreeForm.vue'
import { ProjectSettings } from '../../components/Forms/shared'
import ConfirmationModal from '../../components/Modal/ConfirmationModal.vue'

const props = defineProps<{ projectSettings: ProjectSettings }>()

const { isSupported: isClipboardSupported, copy } = useClipboard()
const router = useRouter()
const globalStore = props.projectSettings.global.useGlobalStore()

const siteTreeInitialParent = ref<SiteTreeFactory | SiteTreeNode | null>(null)
const siteTreeToEdit = ref<SiteTreeNode | null>(null)
const siteTreeToDelete = ref<SiteTreeNode | null>(null)

const currentLangSiteTree = ref<SiteTreeFactory | null>(null)
const baseSiteTreeModel = ref<SiteTreeFactory[]>([])

const loadSiteTree = async () => {
  await globalStore.loadRootSiteTrees()
  currentLangSiteTree.value = null
  try {
    if (globalStore.currentLanguageSiteTreeItem) {
      currentLangSiteTree.value = SiteTreeFactory.constructTree(
        globalStore.currentLanguageSiteTreeItem,
        props.projectSettings.global.clientBaseUrl,
      )
    }
  } catch (e) {
    console.error(e)
  }
}

watch(
  () => globalStore.currentLanguageSiteTreeItem?.['@id'],
  (n, o) => {
    if (!n || n === o) return
    loadSiteTree()
  },
  { immediate: true },
)

watch(
  () => currentLangSiteTree.value,
  (n) => {
    baseSiteTreeModel.value = n ? [n] : []
  },
  { immediate: true },
)

const createSlugCopy = (slug: string) => `${slug}-${createRandomNumber()}`

const duplicateSiteTree = async (
  st: SiteTreeNode,
  stat: { parent?: { data: SiteTreeNode } },
) => {
  if (!currentLangSiteTree.value) return
  const clone: SiteTreeWrite = {
    parent:
      stat.parent?.data['@id'] ??
      (currentLangSiteTree.value as SiteTreeNode)['@id'],
    title: st.title,
    type: st.type,
    isActive: st.isActive,
    isVisible: st.isVisible,
    slug: createSlugCopy(st.slug),
    metaTitle: st.metaTitle,
    metaDescription: st.metaDescription,
  }
  try {
    const newSiteTree =
      await props.projectSettings.siteTree.siteTreeRepository.create(clone)
    siteTreeToEdit.value = new SiteTreeNode(
      newSiteTree.id,
      newSiteTree['@id'],
      newSiteTree.title,
      newSiteTree.slug,
      newSiteTree.type,
      newSiteTree.isActive,
      newSiteTree.isVisible,
      newSiteTree.metaTitle,
      newSiteTree.metaDescription,
      newSiteTree.parent,
    )

    siteTreeFormKey.value++
  } catch (e) {
    console.error(e)
  } finally {
    await loadSiteTree()
  }
}

const onDeletionConfirmed = async () => {
  try {
    await props.projectSettings.siteTree.siteTreeRepository.delete(
      siteTreeToDelete.value!['@id'],
    )
  } catch (e) {
    console.error(e)
  } finally {
    siteTreeToDelete.value = null
    await loadSiteTree()
  }
}

const siteTreeFormKey = ref(0)

// TODO: change position as well, when BE allows it
const handleDragEnd = async () => {
  const promises: Promise<SiteTreeRead>[] = []
  walkTreeData(baseSiteTreeModel.value, (node, i, parent) => {
    if (
      parent &&
      (node as SiteTreeNode).parent?.['@id'] !== (parent as SiteTreeNode)['@id']
    ) {
      promises.push(
        props.projectSettings.siteTree.siteTreeRepository.update(
          (node as SiteTreeNode)['@id'],
          {
            parent: (parent as SiteTreeNode)['@id'] as SiteTreeRead['@id'],
          },
        ),
      )
    }
  })
  if (!promises.length) return

  try {
    await Promise.all(promises)
  } catch (e) {
    console.error(e)
  } finally {
    await loadSiteTree()
  }
}

const expandTree = () => {
  // TODO: implement
}

const collapseTree = () => {
  // TODO: implement
}

const handleSiteTreeCreated = (
  createdSiteTree: SiteTreeRead,
  siteTreeActive: boolean,
  siteTreeVisible: boolean,
) => {
  router.push({
    name: 'SITE_TREE_CONTENT',
    params: { id: createdSiteTree.id },
    query: {
      siteTreeActive: siteTreeActive.toString(),
      siteTreeVisible: siteTreeVisible.toString(),
    },
  })
}

const copyNodePathToClipboard = async (node: SiteTreeNode) => {
  await copy(node.path)
  showSuccessMessage('URL copied to clipboard!')
}
</script>

<style lang="scss" scoped>
.site-tree-list {
  flex: 0 0 calc(100% - 360px - 20px);
}
</style>
