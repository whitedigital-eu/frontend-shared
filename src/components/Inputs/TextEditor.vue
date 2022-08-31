<template>
  <div class="relative" :class="{ small: small }">
    <FormFieldLabel
      :is-placeholder="isEmpty && !isFocused"
      class="mt-[44px] -ml-1 z-[1]"
      title-offset-top="-60px"
      @click="focusEditor"
    >
      {{ label }}
    </FormFieldLabel>
    <div :id="id" v-html="modelValue" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
//@ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import FormFieldLabel from '../FormFieldLabel.vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
  label: {
    type: String,
    required: false,
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  small: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const toolbar: string[] = [
  'bold',
  'italic',
  'link',
  'bulletedList',
  'numberedList',
  '|',
  'undo',
  'redo',
]
const editor = ref<any>(null)

const isEmpty = computed(() => !props.modelValue)
const isFocused = ref(false)

const emit = defineEmits(['update:modelValue'])

const handleInput = (editorValue: string) =>
  emit('update:modelValue', editorValue)

onMounted(() => {
  const el = document.querySelector(`#${props.id}`)
  if (!el) return
  ClassicEditor.create(el, {
    toolbar,
  }).then((ed: any) => {
    ed.model.document.on('change:data', () => handleInput(ed.getData()))
    ed.ui.focusTracker.on(
      'change:isFocused',
      (evt, name, hasFocus) => (isFocused.value = hasFocus)
    )
    editor.value = ed
  })
})

const focusEditor = () => {
  if (!editor.value || isFocused || !isEmpty.value) return
  editor.value.focus()
}
</script>

<style>
.small .ck .ck .ck-content {
  min-height: 107px;
}
</style>
