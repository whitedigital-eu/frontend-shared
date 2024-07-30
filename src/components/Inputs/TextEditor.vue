<template>
  <div class="relative" :class="{ small: small }">
    <FormFieldLabel
      class="-ml-1 mt-[44px] pointer-events-none z-[1]"
      :is-placeholder="!modelValue && !isFocused"
      title-offset-top="-60px"
    >
      {{ label }}
    </FormFieldLabel>
    <CKEditorComponent
      v-model="modelValue"
      :editor="TextEditor"
      @blur="isFocused = false"
      @focus="isFocused = true"
    />
    <div v-if="readonly" class="absolute bg-[#f3f5f6] inset-0 opacity-50"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'
import { TextEditor } from './ckeditor/htmlEditors'
import CKEditor from '@ckeditor/ckeditor5-vue'

const {
  label = '',
  small = false,
  readonly = false,
} = defineProps<{ label?: string; small?: boolean; readonly?: boolean }>()

const modelValue = defineModel<string | undefined>()

const CKEditorComponent = CKEditor.component

const isFocused = ref(false)
</script>

<style>
.small .ck .ck .ck-content {
  min-height: 107px;
}
</style>
