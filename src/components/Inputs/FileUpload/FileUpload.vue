<template>
  <div>
    <div
      ref="fileUploadRef"
      class="dropzone dz-clickable relative"
      :class="{ 'dz-started': anyFiles }"
    >
      <FormFieldLabel v-if="label">{{ label }}</FormFieldLabel>
      <div class="dz-message">
        <span v-if="!anyFiles">{{ dropFilesMessage }}</span>
      </div>
      <template v-if="initialFiles">
        <FilePreview
          v-for="file in initialFiles"
          :key="file.id"
          :allow-delete="allowDelete"
          :allow-download="allowDownload"
          :allow-edit="allowEdit"
          :disabled="deletingFileIri === file['@id']"
          :file="createFileForPreview(file)"
          :host-url="hostUrl"
          @edit-file="emit('edit-file', file['@id'])"
          @remove-file="removeInitialFile(file['@id'])"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import Dropzone from 'dropzone'
import { dropzoneTranslations } from '../../../helpers/Translations'
import FormFieldLabel from '../../FormFieldLabel.vue'
import FilePreview from './FilePreview.vue'
import { AxiosInstance } from 'axios'
import getLoadResourceFunctions from '../../../helpers/DataFetching'
import { FileUploadValue } from '../ValueTypes'
import { Resource } from '../../../types/Resource'
//@ts-ignore
import defaultPreviewTemplate from './preview-template.html?raw'

const props = withDefaults(
  defineProps<{
    modelValue?: FileUploadValue
    label?: string
    axiosInstance: AxiosInstance
    setPublic?: boolean
    endpointUrl?: string
    allowDownload?: boolean
    hostUrl?: string
    allowDelete?: boolean
    allowEdit?: boolean
    dropzoneOptions?: Dropzone.DropzoneOptions
  }>(),
  {
    //@ts-ignore
    modelValue: [] as string[],
    label: '',
    setPublic: false,
    endpointUrl: '/api/storage',
    hostUrl: '',
    allowDownload: false,
    allowDelete: true,
    allowEdit: false,
    dropzoneOptions: () => ({}),
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string[] | string]
  'remove-file': [fileIri: string, callback: () => void]
  'edit-file': [fileIri: string]
}>()

Dropzone.autoDiscover = false

const { loadResource, loadAllResources } = getLoadResourceFunctions(
  props.axiosInstance,
)

type ApiPlatformFile = Resource<string, string> & {
  id: number
  '@id': string
} & (
    | { filePath: string; contentUrl: string }
    | { sourceUrl: string; originalName: string }
  )

const fileUploadRef = ref()
const model = ref<Dropzone | null>(null)
const uploadedFileIris = ref<string[]>([])
const initialFiles = ref<ApiPlatformFile[] | null>(null)
const deletingFileIri = ref<string | null>(null)

const options: Dropzone.DropzoneOptions = {
  url: (props.axiosInstance.defaults.baseURL ?? '') + props.endpointUrl,
  thumbnailWidth: 150,
  maxFilesize: 50,
  // these headers are set to null to fix a CORS issue; source: https://github.com/dropzone/dropzone/pull/685
  headers: {
    //@ts-ignore
    Accept: null,
    //@ts-ignore
    'Cache-Control': null,
    //@ts-ignore
    'X-Requested-With': null,
  },
  addRemoveLinks: false,
  withCredentials: true,
  ...dropzoneTranslations,
  previewTemplate: defaultPreviewTemplate,
  ...props.dropzoneOptions,
}

const singleFileUpload = ref(false)

if (singleFileUpload.value) options.maxFiles = 1

const removeInitialFile = async (fileIri: string) => {
  emit('remove-file', fileIri, async () => {
    if (!initialFiles.value) return
    deletingFileIri.value = fileIri
    try {
      await props.axiosInstance.delete(fileIri)
    } catch (e) {
      console.warn(e)
    } finally {
      initialFiles.value = initialFiles.value.filter(
        (file) => file['@id'] !== fileIri,
      )
      deletingFileIri.value = null
    }
  })
}

const newValue = computed(() => {
  const initialFileIris: string[] = initialFiles.value
    ? initialFiles.value.map((file) => file['@id'])
    : []

  if (singleFileUpload.value) {
    return initialFileIris.length
      ? initialFileIris[0]
      : uploadedFileIris.value[0] ?? ''
  }

  return [...uploadedFileIris.value, ...initialFileIris]
})

const dropFilesMessage = computed(() => {
  return singleFileUpload.value
    ? 'Nometiet failu šeit!'
    : 'Nometiet failus šeit!'
})

const anyFiles = computed(() => {
  return singleFileUpload.value ? !!props.modelValue : props.modelValue?.length
})

watch(newValue, (n) => emit('update:modelValue', n))

const getFileIri = (file: Dropzone.DropzoneFile) => {
  if (file.xhr) return JSON.parse(file.xhr.response)['@id']
}

const initDropzone = () => {
  model.value = new Dropzone(fileUploadRef.value, options)
  model.value.on('success', (file: Dropzone.DropzoneFile) => {
    if (!model.value) return

    if (singleFileUpload.value) {
      if (model.value.files.length > 1) {
        model.value.removeFile(model.value.files[0])
      }
      if (initialFiles.value && initialFiles.value.length > 0)
        initialFiles.value = []
    }

    uploadedFileIris.value = [...uploadedFileIris.value, getFileIri(file)]
  })

  model.value.on('addedfile', async (file: Dropzone.DropzoneFile) => {
    const elements = document.querySelectorAll('.dz-preview')
    const lastElement = elements[elements.length - 1]
    const removeButton = lastElement.querySelector('[dz-remove]')
    if (!props.allowDelete) {
      removeButton?.remove()
    } else {
      removeButton?.addEventListener('click', () =>
        removeFileEvent(file, lastElement),
      )
    }

    const editButton = lastElement.querySelector('[dz-edit]')
    if (!props.allowEdit) {
      editButton?.remove()
    } else {
      editButton?.addEventListener('click', () => editFileEvent(file))
    }
  })

  if (props.setPublic) {
    model.value.on(
      'sending',
      async (file: Dropzone.DropzoneFile, xhr: any, formData: FormData) => {
        formData.append('isPublic', Boolean(true).toString())
      },
    )
  }
}

const loadInitialFiles = async () => {
  if (!props.modelValue) return
  try {
    if (singleFileUpload.value) {
      initialFiles.value = [await loadResource<any>(props.modelValue as string)]
    } else {
      initialFiles.value = await loadAllResources<any>(
        props.modelValue as string[],
      )
    }
  } catch (e) {
    console.error(e)
  }
}

const editFileEvent = (file: Dropzone.DropzoneFile) => {
  const fileIri = getFileIri(file)
  emit('edit-file', fileIri)
}

// file remove for not linked yet
const removeFileEvent = (file: Dropzone.DropzoneFile, element: Element) => {
  const removedFileIri = getFileIri(file)

  props.axiosInstance
    .delete(removedFileIri)
    .then(() => {
      // File successfully deleted, remove it from the uploadedFileIris array.
      uploadedFileIris.value = uploadedFileIris.value.filter(
        (fileIri: string) => fileIri !== removedFileIri,
      )
      element.remove()
    })
    .catch((error) => {
      // Handle any errors that occurred during the delete request, if necessary.
      console.error('Error deleting file:', error)
    })
}

const createFileForPreview = (file: ApiPlatformFile) =>
  'filePath' in file
    ? {
        filePath: file.filePath,
        sourceUrl: file.contentUrl,
        displayName: file.contentUrl,
      }
    : {
        filePath: file.sourceUrl,
        sourceUrl: file.sourceUrl,
        displayName: file.originalName,
      }

onMounted(() => {
  singleFileUpload.value = !Array.isArray(props.modelValue)
  initDropzone()
  loadInitialFiles()
})
</script>

<style lang="scss" scoped>
.initial-file-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-basis: calc(100% - 40px);
  margin-right: 8px;
  line-height: 38px;
}
</style>

<style lang="scss">
.dz-preview {
  // Trust me there is no other way
  .cursor-pointer,
  .cursor-pointer svg,
  .cursor-pointer svg *,
  .cursor-pointer svg path {
    cursor: pointer !important;
  }
}

.dz-details {
  padding-bottom: 0 !important;
}
d .dropzone .dz-preview.dz-error .dz-error-message {
  top: 92px;
  padding-left: 8px;
  padding-right: 8px;
}
</style>
