<template>
  <div class="relative">
    <FormFieldLabel
      v-if="props.label"
      class="z-[2]"
      :is-placeholder="isEmpty && !isOpen"
      :placeholder-css-classes="[
        '!cursor-pointer',
        readonly ? '!z-[1]' : 'z-[2]',
      ]"
      @click.native="handleLabelClick"
    >
      {{ props.label }}
    </FormFieldLabel>
    <select
      :id="selectId"
      ref="selectRef"
      class="tom-select"
      :multiple="multiple"
      :disabled="props.readonly"
    >
      <option value="" />
      <option
        v-for="(option, i) in settings.options"
        :key="i"
        :value="option.value"
        :selected="isOptionSelected(option.value)"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, PropType, onBeforeUnmount } from 'vue'
import TomSelect from 'tom-select'
import 'tom-select/dist/css/tom-select.bootstrap5.min.css'
import FormFieldLabel from '../../FormFieldLabel.vue'
import { createElement, Users, Phone, Video, Mail } from 'lucide'

const props = defineProps({
  settings: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: [String, Array] as PropType<string | string[]>,
    required: false,
    default: '',
  },
  id: {
    type: String,
    required: true,
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
  label: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'create-new-item'])

const selectRef = ref()
const model = ref()
const selectId = computed(() => `tom-select-${props.id}`)
const multiple = computed(() => Array.isArray(props.modelValue))

const isOpen = ref(false)
const isEmpty = ref(false)

const handleLabelClick = () => {
  if (!model.value || props.readonly || isOpen.value) return
  model.value.open()
}

const createNewItem = (e: Event) => {
  const target = e.target as HTMLElement
  const buttonElement: HTMLButtonElement | null =
    target.closest('[data-item-name]')
  emit('create-new-item', buttonElement?.dataset.itemName)
}

const renderCreateButton = (data, escape) => {
  const escapedInput = escape(data.input)

  const createButton = document.createElement('button')
  createButton.classList.add('btn', 'btn-outline', 'ml-3', 'mb-1', 'create')
  createButton.dataset.itemName = escapedInput
  createButton.addEventListener('click', createNewItem)

  const inputTextEl = document.createElement('strong')
  inputTextEl.classList.add('ml-1')
  inputTextEl.innerText = escapedInput

  createButton.innerText = 'Izveidot:'
  createButton.appendChild(inputTextEl)

  return createButton
}

const renderIcon = (data, escape) => {
  const iconContainer = document.createElement('a')
  iconContainer.classList.add('flex', 'w-full')
  iconContainer.title = escape(data.text)

  const iconElement = createElement(
    {
      users: Users,
      'phone-call': Phone,
      video: Video,
      mail: Mail,
    }[data.icon]
  )
  iconElement.classList.add('mx-auto')
  iconContainer.appendChild(iconElement)

  return iconContainer
}

const renderTextOrIcon = function (data, escape) {
  if (!data.icon) return `<div>${escape(data.text)}</div>`
  return renderIcon(data, escape)
}

const settings: any = {
  ...props.settings,
  plugins: {
    dropdown_input: {},
    clear_button: {
      title: 'Dzēst',
      html: function (data) {
        return `<span class="text-xl -mt-[2px] ${data.className}" title="${data.title}">&#10005;</span>`
      },
    },
    ...props.settings.plugins,
  },
  maxItems: multiple.value ? 10 : 1,
  maxOptions: 250,
  allowEmptyOptions: true,
  createFilter: function (input: string) {
    return !(input.toLowerCase() in this.options)
  },
  onChange(selected: string | string[]) {
    const newValue: string | string[] = Array.isArray(selected)
      ? [...selected]
      : selected
    isEmpty.value = selected.length === 0
    emit('update:modelValue', newValue)
  },
  onDropdownOpen() {
    isOpen.value = true
  },
  onDropdownClose() {
    isOpen.value = false
  },
  render: {
    option: renderTextOrIcon,
    item: renderTextOrIcon,
    option_create: renderCreateButton,
    no_results: function (data, escape) {
      return `<div class="no-results">Netika atrasti rezultāti vaicājumam "${escape(
        data.input
      )}"</div>`
    },
  },
}

if (multiple.value) {
  settings.plugins.remove_button = {
    title: 'Noņemt vērtību',
  }
}

const isOptionSelected = (value: string) => {
  return multiple.value
    ? (props.modelValue as string[]).includes(value)
    : (props.modelValue as string) === value
}

const init = () => {
  model.value = new TomSelect(selectRef.value, settings)
}

const refreshOptions = (options) => {
  model.value.clearOptions()
  model.value.addOptions(options)
  if (options.length) model.value.refreshOptions(false)
}

const refreshValue = (value) => {
  model.value.setValue(value, true)
}

onMounted(init)

watch(() => props.settings.options, refreshOptions)
watch(() => props.modelValue, refreshValue)
watch(
  () => props.modelValue,
  () =>
    (isEmpty.value =
      !props.modelValue ||
      (!!props.modelValue && props.modelValue.length === 0)),
  { immediate: true }
)
watch(
  () => props.readonly,
  (n) => {
    n ? model.value.disable() : model.value.enable()
  }
)

onBeforeUnmount(() => {
  model.value.clearActiveItems()
  model.value.clearOptions()
  model.value.destroy()
})
</script>

<style>
.ts-control {
  min-height: 38px;
}
</style>
