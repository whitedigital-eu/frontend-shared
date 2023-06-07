<template>
  <div>
    <div
      ref="fileUploadRef"
      class="dropzone dz-clickable relative"
      :class="{ 'dz-started': anyFiles }"
    >
      <FormFieldLabel v-if="label">
        {{ label }}
      </FormFieldLabel>
      <div class="dz-message">
        <span v-if="!anyFiles">{{ dropFilesMessage }}</span>
      </div>
      <template v-if="initialFiles">
        <FilePreview
          v-for="file in initialFiles"
          :key="file.id"
          :allow-download="allowDownload"
          :disabled="deletingFileIri === file['@id']"
          :file="createFileForPreview(file)"
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

const props = withDefaults(
  defineProps<{
    modelValue?: FileUploadValue
    label?: string
    axiosInstance: AxiosInstance
    setPublic?: boolean
    endpointUrl?: string
    allowDownload?: boolean
  }>(),
  {
    //@ts-ignore
    modelValue: [] as string[],
    label: '',
    setPublic: false,
    endpointUrl: '/api/storage',
    allowDownload: false,
  }
)

const emit = defineEmits(['update:modelValue', 'remove-file'])

Dropzone.autoDiscover = false

const { loadResource, loadAllResources } = getLoadResourceFunctions(
  props.axiosInstance
)

type ApiPlatformFile = Resource<string, string> &
  (
    | { filePath: string; contentUrl: string }
    | { sourceUrl: string; originalName: string }
  )

const fileUploadRef = ref()
const model = ref<Dropzone | null>(null)
const uploadedFileIris = ref<string[]>([])
const initialFiles = ref<ApiPlatformFile[] | null>(null)
const deletingFileIri = ref<string | null>(null)

const options: Dropzone.DropzoneOptions = {
  url: props.endpointUrl,
  thumbnailWidth: 150,
  maxFilesize: 50,
  headers: {
    Accept: 'application/ld+json',
  },
  addRemoveLinks: true,
  ...dropzoneTranslations,
}

const singleFileUpload = ref(false)

if (singleFileUpload.value) options.maxFiles = 1

const removeInitialFile = async (fileIri: string) => {
  emit('remove-file', fileIri, async () => {
    if (!initialFiles.value) return
    deletingFileIri.value = fileIri
    try {
      await props.axiosInstance.delete(fileIri)
      initialFiles.value = initialFiles.value.filter(
        (file: any) => file['@id'] !== fileIri
      )
    } catch (e) {
      console.error(e)
    } finally {
      deletingFileIri.value = null
    }
  })
}

const newValue = computed(() => {
  const initialFileIris: string[] = initialFiles.value
    ? initialFiles.value.map((file: any) => file['@id'])
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

watch(newValue, (n: string | string[]) => emit('update:modelValue', n))

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
  model.value.on('removedfile', async (file: Dropzone.DropzoneFile) => {
    const removedFileIri = getFileIri(file)
    try {
      await props.axiosInstance.delete(removedFileIri)
    } finally {
      uploadedFileIris.value = uploadedFileIris.value.filter(
        (fileIri: string) => fileIri !== removedFileIri
      )
    }
  })
  if (props.setPublic) {
    model.value.on(
      'sending',
      async (file: Dropzone.DropzoneFile, xhr: any, formData: FormData) => {
        formData.append('isPublic', Boolean(true).toString())
      }
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
        props.modelValue as string[]
      )
    }
  } catch (e) {
    console.error(e)
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

<style>
.dz-details {
  padding-bottom: 0 !important;
}
</style>
