<template>
  <div class="relative" :class="{ small: small }">
    <label>{{ label }}</label>
    <CKEditorComponent
      v-model="internalValue"
      :editor="HtmlEditor"
      @blur="isFocused = false"
      @focus="isFocused = true"
      @ready="setupElfinder"
    />
    <div v-if="readonly" class="disabled-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { HtmlEditor } from './ckeditor/htmlEditors'
import CKEditor from '@ckeditor/ckeditor5-vue'
import { setupElfinder } from './ckeditor/setupElfinder'

const {
  modelValue,
  label = '',
  small = false,
  readonly = false,
} = defineProps<{
  modelValue: string | number | null
  label?: string
  small?: boolean
  readonly?: boolean
}>()

const emit = defineEmits<{ (e: 'update:modelValue', content: string): void }>()

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
}
</style>

<style scoped lang="scss">
.disabled-overlay {
  position: absolute;
  inset: 0;
  background: #f3f5f6;
  opacity: 0.5;
}
</style>
