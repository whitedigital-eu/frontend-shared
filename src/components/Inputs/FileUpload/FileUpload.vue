<template>
  <div>
    <div
      ref="fileUploadRef"
      class="dropzone dz-clickable relative"
      :class="{ 'dz-started': anyFiles }"
    >
      <FormFieldLabel v-if="label">{{ label }}</FormFieldLabel>
      <div class="dz-message">
        <span>{{ dropFilesMessage }}</span>
      </div>
      <template v-if="initialFiles">
        <FilePreview
          v-for="file in initialFiles"
          :key="file.id"
          :config="computedConfig"
          :disabled="deletingFileIri === file['@id']"
          :file="createFileForPreview(file)"
          @edit-file="emit('edit-file', file['@id'])"
          @remove-file="removeInitialFile(file['@id'])"
        />
      </template>
      <div
        v-if="computedConfig.readonly || isAddingFile || isRemovingFile"
        class="absolute bg-[#f3f5f6] inset-0 opacity-50 z-[31]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends string | string[]">
import { ref, onMounted, watch, computed } from 'vue'
import Dropzone, { DropzoneOptions } from 'dropzone'
import { dropzoneTranslations } from '../../../helpers/Translations'
import FormFieldLabel from '../../FormFieldLabel.vue'
import FilePreview from './FilePreview.vue'
import getLoadResourceFunctions from '../../../helpers/DataFetching'
import { Resource } from '../../../types/Resource'
//@ts-ignore
import defaultPreviewTemplate from './preview-template.html?raw'
import { FileUploadConfig } from '../../../types/InputFields'
import _ from 'lodash'
import useIsMobile from '../../../composables/useIsMobile'

const props = withDefaults(
  defineProps<{
    modelValue?: T | null
    label?: string
    config: FileUploadConfig
  }>(),
  {
    //@ts-ignore
    modelValue: [] as string[],
    label: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string[] | string]
  'remove-file': [fileIri: string, callback: () => void]
  'edit-file': [fileIri: string]
  'on-error': [dz: Dropzone, file: Dropzone.DropzoneFile]
}>()

Dropzone.autoDiscover = false

const computedConfig = computed(() =>
  _.merge(
    {
      allowDownload: false,
      allowEdit: false,
      allowDelete: true,
      setPublic: false,
      endpointUrl: '/api/storage',
      dropzoneOptions: {},
      readonly: false,
    },
    props.config,
  ),
)

const { isMobile } = useIsMobile()
const { loadResource, loadAllResources } = getLoadResourceFunctions(
  // eslint-disable-next-line vue/no-ref-object-destructure
  computedConfig.value.axiosInstance,
)

type ApiPlatformFile = Resource<string, string> & {
  id: number
  '@id': string
} & (
    | { filePath: string; contentUrl: string }
    | { sourceUrl: string; originalName: string }
  )

const fileUploadRef = ref<HTMLElement>()
const model = ref<Dropzone | null>(null)
const uploadedFileIris = ref<string[]>([])
const initialFiles = ref<ApiPlatformFile[] | null>(null)
const deletingFileIri = ref<string | null>(null)

const options = computed<DropzoneOptions>(() => {
  const res: DropzoneOptions = {
    url:
      (computedConfig.value.axiosInstance.defaults.baseURL ?? '') +
      computedConfig.value.endpointUrl,
    thumbnailWidth: 150,
    maxFilesize: 50,
    // these headers are set to null to fix a CORS issue; source: https://github.com/dropzone/dropzone/pull/685
    headers: {
      Accept: null as unknown as string,
      'Cache-Control': null as unknown as string,
      'X-Requested-With': null as unknown as string,
    },
    addRemoveLinks: false,
    withCredentials: true,
    ...dropzoneTranslations,
    previewTemplate: defaultPreviewTemplate,
    ...computedConfig.value.dropzoneOptions,
  }

  if (singleFileUpload.value) {
    res.maxFiles = 1
  }

  return res
})

const singleFileUpload = computed(() => !Array.isArray(props.modelValue))

const removeInitialFile = async (fileIri: string) => {
  emit('remove-file', fileIri, async () => {
    if (!initialFiles.value) return

    isRemovingFile.value = true
    deletingFileIri.value = fileIri

    try {
      await computedConfig.value.axiosInstance.delete(fileIri)
    } catch (e) {
      console.warn(e)
    } finally {
      initialFiles.value = initialFiles.value.filter(
        (file) => file['@id'] !== fileIri,
      )
      deletingFileIri.value = null
      isRemovingFile.value = false
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

const dropFilesMessage = computed(() =>
  isMobile.value
    ? singleFileUpload.value
      ? 'Spiediet šeit, lai augšupielādētu failu'
      : 'Spiediet šeit, lai augšupielādētu failus'
    : singleFileUpload.value
      ? 'Nometiet failu šeit!'
      : 'Nometiet failus šeit!',
)

const anyFiles = computed(() =>
  singleFileUpload.value ? !!props.modelValue : props.modelValue?.length,
)

watch(newValue, (n) => emit('update:modelValue', n))

const getFileIri = (file: Dropzone.DropzoneFile) => {
  if (file.xhr) return JSON.parse(file.xhr.response)['@id']
}

const isAddingFile = ref(false)

const initDropzone = () => {
  if (!fileUploadRef.value) return

  model.value = new Dropzone(fileUploadRef.value, options.value)
  model.value.on('success', (file: Dropzone.DropzoneFile) => {
    isAddingFile.value = false

    if (!model.value) return

    if (singleFileUpload.value) {
      if (model.value.files.length > 1) {
        model.value.removeFile(model.value.files[0])
      }
      if (initialFiles.value && initialFiles.value.length > 0) {
        initialFiles.value = []
      }
    }

    uploadedFileIris.value = [...uploadedFileIris.value, getFileIri(file)]
  })

  model.value.on('error', (file: Dropzone.DropzoneFile) => {
    isAddingFile.value = false

    if (model.value) {
      emit('on-error', model.value, file)
    }
  })

  model.value.on('addedfile', async (file: Dropzone.DropzoneFile) => {
    isAddingFile.value = true

    const elements = document.querySelectorAll('.dz-preview')
    const lastElement = elements[elements.length - 1]
    const removeButton = lastElement.querySelector('[dz-remove]')
    if (!computedConfig.value.allowDelete) {
      removeButton?.remove()
    } else {
      removeButton?.addEventListener('click', () =>
        removeFileEvent(file, lastElement),
      )
    }

    const editButton = lastElement.querySelector('[dz-edit]')
    if (!computedConfig.value.allowEdit) {
      editButton?.remove()
    } else {
      editButton?.addEventListener('click', () => editFileEvent(file))
    }
  })

  if (computedConfig.value.setPublic) {
    model.value.on(
      'sending',
      async (_file: Dropzone.DropzoneFile, _xhr: any, formData: FormData) => {
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

const isRemovingFile = ref(false)

// file remove for not linked yet
const removeFileEvent = async (
  file: Dropzone.DropzoneFile,
  element: Element,
) => {
  const removedFileIri = getFileIri(file)

  isRemovingFile.value = true

  if (computedConfig.value?.beforeUploadedFileDeletion) {
    try {
      await computedConfig.value.beforeUploadedFileDeletion(removedFileIri)
    } catch (e) {
      console.error(e)
    }
  }

  try {
    await computedConfig.value.axiosInstance.delete(removedFileIri)

    // File successfully deleted, remove it from the uploadedFileIris array.
    uploadedFileIris.value = uploadedFileIris.value.filter(
      (fileIri: string) => fileIri !== removedFileIri,
    )
    element.remove()
  } catch (e) {
    // Handle any errors that occurred during the delete request, if necessary.
    console.error('Error deleting file:', e)
  } finally {
    isRemovingFile.value = false
  }
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

.dropzone .dz-preview.dz-error .dz-error-message {
  top: 92px;
  padding-left: 8px;
  padding-right: 8px;
}

// Do not hide the message when any files uploaded. Adapted from: https://github.com/dropzone/dropzone/issues/524
.dropzone.dz-started .dz-message {
  display: block;
}

.dropzone.dz-max-files-reached .dz-message {
  display: none;
}
</style>
