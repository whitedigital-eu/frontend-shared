<template>
  <div
    class="bg-white border border-[transparent] flex gap-2 items-center mb-1 p-2 pl-3 rounded-md"
    :class="{
      'border-slate-400': isSelected,
      'bg-opacity-50 border-slate-200 text-slate-400': !node.isActive,
    }"
  >
    <span class="flex grow items-center justify-start">
      <button
        v-if="hasChildren"
        class="mr-2"
        @click="emit('click:toggle-open')"
      >
        <Icon :name="isOpen ? 'ChevronDown' : 'ChevronRight'" size="14" />
      </button>
      <router-link
        class="inline-block max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap"
        :class="{
          'opacity-50 pointer-events-none cursor-default':
            !siteTreeContentRepository,
        }"
        :to="{ name: 'SITE_TREE_CONTENT', params: { id: node.id } }"
      >
        {{ node.title }}
      </router-link>
    </span>
    <span class="flex gap-4">
      <span class="flex gap-1 text-slate-500 text-xs">
        <span
          v-if="!node.isActive"
          class="bg-danger bg-opacity-20 p-[3px] rounded-sm text-danger"
          data-testid="inactive-badge"
        >
          <Icon name="Ban" size="10" />
        </span>
        <span
          v-if="!node.isVisible"
          class="bg-opacity-20 bg-warning p-[3px] rounded-sm text-pending"
          data-testid="invisible-badge"
        >
          <Icon name="EyeOff" size="10" />
        </span>
        <span class="bg-secondary/50 px-1 rounded-sm">
          {{ projectSettings.siteTree.siteTreeTypeToLabel(node.type) }}
        </span>
      </span>
      <span class="flex gap-1 items-center">
        <button
          class="btn btn-primary p-0.5 rounded-xs"
          data-testid="btn-edit"
          @click="emit('click:edit')"
        >
          <Icon name="Settings" size="10" />
        </button>
        <button
          class="btn btn-secondary btn-sm p-0.5 rounded-xs"
          data-testid="btn-duplicate"
          @click="emit('click:duplicate')"
        >
          <Icon name="Files" size="10" />
        </button>
        <button
          class="border-emerald-100 btn btn-sm btn-success p-0.5 rounded-xs"
          data-testid="btn-add"
          @click="emit('click:add')"
        >
          <Icon name="Plus" size="10" />
        </button>
        <button
          class="border-red-100 btn btn-danger btn-sm p-0.5 rounded-xs"
          data-testid="btn-delete"
          @click="emit('click:delete')"
        >
          <Icon name="Trash2" size="10" />
        </button>
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import Icon from '../../components/Icons/Icon.vue'
import SiteTreeNode from '../Models/SiteTreeNode'
import { ProjectSettings } from '../../components/Forms/shared'
import { computed } from 'vue'

const props = defineProps<{
  node: SiteTreeNode
  hasChildren: boolean
  isOpen: boolean
  isSelected: boolean
  projectSettings: ProjectSettings
}>()

const emit = defineEmits<{
  'click:toggle-open': []
  'click:edit': []
  'click:duplicate': []
  'click:add': []
  'click:delete': []
}>()

const siteTreeContentRepository = computed(() => {
  if (!props.node) return null
  return props.projectSettings.siteTree.siteTreeTypeToRepository(
    props.node.type,
  )
})
</script>
