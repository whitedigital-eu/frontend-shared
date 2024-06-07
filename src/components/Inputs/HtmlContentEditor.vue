<template>
  <div class="relative" :class="{ small: small }">
    <label>{{ label }}</label>
    <CKEditorComponent
      v-model="internalValue"
      :editor="HtmlEditor"
      @blur="isFocused = false"
      @focus="isFocused = true"
      @ready="(editor: ClassicEditor) => setupElfinder(editor, connectionUrl)"
    />
    <div v-if="readonly" class="absolute bg-[#f3f5f6] inset-0 opacity-50"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { HtmlEditor } from './ckeditor/htmlEditors'
import CKEditor from '@ckeditor/ckeditor5-vue'
import { setupElfinder } from './ckeditor/setupElfinder'
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'

const {
  modelValue,
  label = '',
  small = false,
  readonly = false,
  apiUrl,
  apiOrigin,
} = defineProps<{
  modelValue: string | number | null | undefined
  label?: string
  small?: boolean
  readonly?: boolean
  /**
   * The API origin
   * @example https://example.com
   * @deprecated Use `apiUrl` instead
   */
  apiOrigin?: string
  /**
   * The full elfinder API URL
   * @example https://example.com/api/efconnect
   */
  apiUrl?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [content: string | undefined]
}>()

const defaultUrlSuffix = '/api/efconnect'

const connectionUrl = computed(() => {
  if (apiUrl) return apiUrl
  if (apiOrigin) return apiOrigin + defaultUrlSuffix
  return ''
})

const CKEditorComponent = CKEditor.component

const internalValue = ref(
  typeof modelValue === 'number'
    ? modelValue.toString()
    : modelValue !== null
      ? modelValue
      : '',
)
watch(internalValue, (n) => emit('update:modelValue', n))

const isFocused = ref(false)
</script>

<style>
.small .ck .ck .ck-content {
  min-height: 107px;
}

.ck-powered-by-balloon {
  display: none !important;
}

.ck-editor {
  ul,
  ol {
    @apply pl-3;
  }
  a {
    @apply text-primary underline;
  }
  h2 {
    @apply text-2xl font-medium;
  }
  h3 {
    @apply text-xl font-medium;
  }
  h4 {
    @apply text-lg font-medium;
  }
  h5 {
    @apply text-base font-medium;
  }
}
</style>
