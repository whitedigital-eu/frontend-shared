<template>
  <div class="dz-complete dz-image-preview dz-preview dz-processing dz-success">
    <div class="dz-image">
      <img
        v-if="isImage"
        :alt="file.displayName"
        class="h-[120px] object-cover w-[120px]"
        :src="config.hostUrl + file.sourceUrl"
      />
      <div v-else class="-translate-y-[50%] ml-[9%] mt-[50%]">
        <span class="file__icon file__icon--file w-24">
          <span class="file__icon__file-name text-xs">{{ fileExtension }}</span>
        </span>
      </div>
    </div>
    <div
      v-if="config.allowEdit || config.allowDelete"
      class="absolute bg-[rgba(0,0,0,0.5)] dz-actions flex flex-row flex-wrap gap-2 justify-end p-1.5 right-0 rounded-md text-white top-0 z-30"
    >
      <button v-if="config.allowEdit" dz-edit type="button">
        <FileEditIcon
          class="cursor-pointer"
          height="20"
          width="20"
          @click="emit('edit-file', file)"
        />
      </button>
      <button
        v-if="config.allowDelete"
        class="cursor-pointer"
        dz-remove
        type="button"
      >
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
      <div v-if="config.allowDownload" class="my-4">
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
import { FileUploadConfig } from '../../../types/InputFields'

type FileForDisplay = {
  filePath: string
  sourceUrl: string
  displayName: string
}

const props = defineProps<{
  file: FileForDisplay
  config: Omit<Required<FileUploadConfig>, 'beforeUploadedFileDeletion'>
}>()

const emit = defineEmits<{
  'remove-file': [file: FileForDisplay]
  'edit-file': [file: FileForDisplay]
}>()

const { fileExtension, isImage } = useFileInfo(props.file)
</script>
