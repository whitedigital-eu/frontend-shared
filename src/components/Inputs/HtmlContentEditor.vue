<template>
  <div class="relative" :class="{ small: small }">
    <label>{{ label }}</label>
    <CKEditorComponent
      v-model="internalValue"
      :editor="HtmlEditor"
      @blur="isFocused = false"
      @focus="isFocused = true"
      @ready="(editor: ClassicEditor) => setupElfinder(editor, apiOrigin)"
    />
    <div v-if="readonly" class="absolute bg-[#f3f5f6] inset-0 opacity-50"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { HtmlEditor } from './ckeditor/htmlEditors'
import CKEditor from '@ckeditor/ckeditor5-vue'
import { setupElfinder } from './ckeditor/setupElfinder'
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'

const {
  modelValue,
  label = '',
  small = false,
  readonly = false,
} = defineProps<{
  modelValue: string | number | null | undefined
  label?: string
  small?: boolean
  readonly?: boolean
  apiOrigin: string
}>()

const emit = defineEmits<{
  'update:modelValue': [content: string | undefined]
}>()

const CKEditorComponent = CKEditor.component

const internalValue = ref(
  typeof modelValue === 'number'
    ? modelValue.toString()
    : modelValue !== null
    ? modelValue
    : ''
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
