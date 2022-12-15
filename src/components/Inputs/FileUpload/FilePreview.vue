<template>
  <div class="dz-preview dz-processing dz-image-preview dz-success dz-complete">
    <div class="dz-image relative">
      <img v-if="isImage" :alt="file.displayName" :src="file.sourceUrl" />
      <div class="file">
        <span class="w-24 file__icon file__icon--file">
          <span class="file__icon__file-name text-xs">{{ fileExtension }}</span>
        </span>
      </div>
    </div>
    <div class="dz-details">
      <div class="dz-filename">
        <span>{{ file.filePath }}</span>
      </div>
      <div v-if="allowDownload" class="my-4">
        <a
          :href="file.sourceUrl"
          download
          title="Lejupielādēt"
          class="btn btn-outline-primary !cursor-pointer"
        >
          <Download class="h-6 w-6 !cursor-pointer" />
        </a>
      </div>
    </div>
    <a class="dz-remove" @click="emit('remove-file', file)">Noņemt failu</a>
  </div>
</template>

<script setup lang="ts">
import useFileInfo from '../../../composables/useFileInfo'
import { Download } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    file: {
      filePath: string
      sourceUrl: string
      displayName: string
    }
    allowDownload?: boolean
  }>(),
  { allowDownload: false }
)

const emit = defineEmits<{
  (e: 'remove-file', file: any): void
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
