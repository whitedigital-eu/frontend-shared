import {
  fileExtensionsToPreview,
  imageExtensions,
  previewSiteUrl,
} from '../helpers/FileUtilities'
import { computed } from 'vue'

export default function useFileInfo(file: {
  filePath: string
  contentUrl: string
}) {
  const fileExtension = computed(() => file.filePath.split('.').pop())
  const fileName = computed(() => {
    if (!fileExtension.value) return ''
    return file.filePath.slice(0, -(fileExtension.value.length + 1))
  })

  const isImage = computed(() => {
    if (!fileExtension.value) return false
    return imageExtensions.includes(fileExtension.value)
  })
  const shouldPreviewFile = computed(() => {
    if (!fileExtension.value) return false
    return fileExtensionsToPreview.includes(fileExtension.value)
  })
  const filePreviewHref = computed(() => {
    if (!shouldPreviewFile.value) return file.contentUrl
    return `${previewSiteUrl}${window.location.origin}${file.contentUrl}`
  })

  return {
    fileExtension,
    fileName,
    isImage,
    shouldPreviewFile,
    filePreviewHref,
  }
}
