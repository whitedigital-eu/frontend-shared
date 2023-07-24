<template>
  <div class="dz-complete dz-image-preview dz-preview dz-processing dz-success">
    <div class="dz-image">
      <img
        v-if="isImage"
        :alt="file.displayName"
        class="h-[120px] object-cover w-[120px]"
        :src="hostUrl + file.sourceUrl"
      />
      <div v-else class="file">
        <span class="file__icon file__icon--file w-24">
          <span class="file__icon__file-name text-xs">{{ fileExtension }}</span>
        </span>
      </div>
    </div>
    <div
      class="absolute dz-actions flex flex-row flex-wrap justify-end right-1 text-white top-1 w-full z-30"
    >
      <button v-if="allowEdit" type="button" dz-edit>
        <FileEditIcon
          class="cursor-pointer"
          height="20"
          width="20"
          @click="emit('edit-file', file)"
        />
      </button>
      <button v-if="allowDelete" type="button" class="cursor-pointer" dz-remove>
        <Trash2Icon
          class="cursor-pointer"
          height="20"
          width="20"
          @click="emit('remove-file', file)"
        />
      </button>
    </div>
    <div class="dz-details">
      <div class="dz-filename">
        <span>{{ file.filePath }}</span>
      </div>
      <div v-if="allowDownload" class="my-4">
        <a
          class="!cursor-pointer btn btn-outline-primary"
          download
          :href="file.sourceUrl"
          title="Lejupielādēt"
        >
          <Download class="!cursor-pointer h-6 w-6" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useFileInfo from '../../../composables/useFileInfo'
import { Download, Trash2Icon, FileEditIcon } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    file: {
      filePath: string
      sourceUrl: string
      displayName: string
    }
    allowDownload?: boolean
    allowDelete?: boolean
    allowEdit?: boolean
    hostUrl: string
  }>(),
  { allowDownload: false }
)

const emit = defineEmits<{
  (e: 'remove-file', file: any): void
  (e: 'edit-file', file: any): void
}>()

const { fileExtension, isImage } = useFileInfo(props.file)
</script>

<style lang="scss" scoped>
.file {
  margin-top: 50%;
  margin-left: 9%;
  transform: translatey(-50%);
}
</style>
