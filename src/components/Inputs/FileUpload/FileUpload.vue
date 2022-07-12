<template>
  <div>
    <div
      ref="fileUploadRef"
      class="dropzone relative dz-clickable"
      :class="{ 'dz-started': anyFiles }"
    >
      <FormFieldLabel v-if="label">
        {{ label }}
      </FormFieldLabel>
      <div class="dz-message">
        <span v-if="!anyFiles">{{ dropFilesMessage }}</span>
      </div>
      <FilePreview
        v-for="file in initialFiles"
        v-if="initialFiles"
        :key="file.id"
        :file="file"
        :disabled="deletingFileIri === file['@id']"
        @remove-file="removeInitialFile(file['@id'])"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, PropType, watch, computed } from 'vue'
import Dropzone from 'dropzone'
import { dropzoneTranslations } from '../../../helpers/Translations'
import FormFieldLabel from '../../FormFieldLabel.vue'
import FilePreview from './FilePreview.vue'
import { AxiosInstance } from 'axios'
import getLoadResourceFunctions from '../../../helpers/DataFetching'

Dropzone.autoDiscover = false

const props = defineProps({
  modelValue: {
    type: [String, Array] as PropType<string | string[]>,
    required: false,
    default: () => [],
  },
  label: {
    type: String,
    required: false,
    default: '',
  },
  axiosInstance: {
    type: Function as PropType<AxiosInstance>,
    required: true,
  },
  setPublic: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'remove-file'])

const { loadResource, loadAllResources } = getLoadResourceFunctions(
  props.axiosInstance
)

const fileUploadRef = ref()
const model = ref<any>(null)
const uploadedFileIris = ref<string[]>([])
const initialFiles = ref<any[] | null>(null)
const deletingFileIri = ref<string | null>(null)

const options: any = {
  url: '/api/storage',
  thumbnailWidth: 150,
  maxFilesize: 50,
  headers: {
    Accept: 'application/ld+json',
  },
  addRemoveLinks: true,
  ...dropzoneTranslations,
}

const singleFileUpload = ref(false)

if (singleFileUpload.value) {
  options.maxFiles = 1
}

const removeInitialFile = async (fileIri: string) => {
  emit('remove-file', fileIri, async () => {
    if (!initialFiles.value) return
    deletingFileIri.value = fileIri
    try {
      await props.axiosInstance.delete(fileIri)
      deletingFileIri.value = null
      initialFiles.value = initialFiles.value.filter(
        (file: any) => file['@id'] !== fileIri
      )
    } finally {
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

const getFileIri = (file: any) => JSON.parse(file.xhr.response)['@id']

const initDropzone = () => {
  model.value = new Dropzone(fileUploadRef.value, options)
  model.value.on('success', (file: any) => {
    if (singleFileUpload.value) {
      if (model.value.files.length > 1) {
        model.value.removeFile(model.value.files[0])
      }
      if (initialFiles.value && initialFiles.value.length > 0)
        initialFiles.value = []
    }

    uploadedFileIris.value = [...uploadedFileIris.value, getFileIri(file)]
  })
  model.value.on('removedfile', async (file: any) => {
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
    model.value.on('sending', async (file, xhr, formData) => {
      formData.append('isPublic', true)
    })
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
  } finally {
  }
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
