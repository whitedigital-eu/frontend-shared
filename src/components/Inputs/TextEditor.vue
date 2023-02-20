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
    <div v-if="readonly" class="disabled-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import FormFieldLabel from '../FormFieldLabel.vue'
import { TextEditorValue } from './ValueTypes'

const props = defineProps({
  modelValue: {
    type: [String, Number] as PropType<TextEditorValue>,
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
  readonly: {
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
const editor = ref<ClassicEditor | null>(null)

const isEmpty = computed(() => !props.modelValue)
const isFocused = ref(false)

const emit = defineEmits(['update:modelValue'])

const handleInput = (editorValue: string) =>
  emit('update:modelValue', editorValue)

onMounted(async () => {
  const el = document.querySelector(`#${props.id}`)
  if (!el) return

  const ed = await ClassicEditor.create(el as HTMLElement, { toolbar })

  ed.model.document.on('change:data', () => handleInput(ed.getData()))
  ed.ui.focusTracker.on(
    'change:isFocused',
    //@ts-ignore
    (evt, name, hasFocus) => (isFocused.value = hasFocus)
  )
  editor.value = ed
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

<style scoped lang="scss">
.disabled-overlay {
  position: absolute;
  inset: 0;
  background: #f3f5f6;
  opacity: 0.5;
}
</style>
