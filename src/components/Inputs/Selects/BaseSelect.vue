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
      @click="handleLabelClick"
    >
      {{ props.label }}
    </FormFieldLabel>
    <select
      :id="selectId"
      ref="selectRef"
      class="tom-select"
      :disabled="props.readonly"
      :multiple="multiple"
      :placeholder="!(isEmpty && !isOpen) ? searchInputPlaceholder : ''"
    >
      <option value=""></option>
      <option
        v-for="(option, i) in settings.options as Array<RecursivePartial<{text: string, value: string}>>"
        :key="i"
        :selected="isOptionSelected(option.value ?? '')"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue'
//@ts-ignore
import TomSelect from 'tom-select'
import 'tom-select/dist/css/tom-select.bootstrap5.min.css'
import FormFieldLabel from '../../FormFieldLabel.vue'
import { createElement, Users, Phone, Video, Mail } from 'lucide'
import type {
  RecursivePartial,
  TomOption,
  TomSettings,
  TomTemplate,
} from 'tom-select/src/types'

type ModelValue = string | string[]

const props = withDefaults(
  defineProps<{
    settings?: RecursivePartial<TomSettings>
    modelValue?: ModelValue
    id: string
    readonly?: boolean
    label?: string | null
    allowDelete?: boolean
    searchInputPlaceholder?: string
  }>(),
  {
    //@ts-ignore
    settings: {} as RecursivePartial<TomSettings>,
    modelValue: '',
    readonly: false,
    label: null,
    allowDelete: true,
    searchInputPlaceholder: '',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | number]
  'create-new-item': [itemName: string | undefined]
}>()

const selectRef = ref()
const model = ref()
const selectId = computed(() => `tom-select-${props.id}`)
const multiple = computed(() => Array.isArray(props.modelValue))

const isOpen = ref(false)
const isEmpty = ref(false)

watch(isOpen, (n) => {
  if (!n || !model.value.dropdown) return
  const parentModalBody = model.value.dropdown.closest('.modal-body')
  if (parentModalBody) {
    setTimeout(() => model.value.dropdown.scrollIntoView(), 0) //FIXME: should only scroll into view if dropdown overflows modal body!
  }
})

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

const renderCreateButton: TomTemplate = (
  data: TomOption,
  escape: (str: string) => string
) => {
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

const iconMapping = {
  users: Users,
  'phone-call': Phone,
  video: Video,
  mail: Mail,
} as const

const isKeyOfIconMapping = (
  maybeKeyOfIconMapping: string
): maybeKeyOfIconMapping is keyof typeof iconMapping => {
  return maybeKeyOfIconMapping in iconMapping
}

const renderIcon: TomTemplate = (data, escape) => {
  const iconContainer = document.createElement('a')
  iconContainer.classList.add('flex', 'w-full')
  iconContainer.title = escape(data.text)

  if (isKeyOfIconMapping(data.icon)) {
    const iconElement = createElement(iconMapping[data.icon])
    iconElement.classList.add('mx-auto')
    iconContainer.appendChild(iconElement)
  }

  return iconContainer
}

const renderTextOrIcon: TomTemplate = function (data, escape) {
  if (!data.icon) return `<div>${escape(data.text)}</div>`
  return renderIcon(data, escape)
}

const createPlugins = () => {
  const plugins: TomSettings['plugins'] = {
    dropdown_input: {},
  }
  if (props.allowDelete) {
    plugins.clear_button = {
      title: 'Dzēst',
      html: function (data: { className: string; title: string }) {
        return `<span class="text-xl -mt-[2px] ${data.className}" title="${data.title}">&#10005;</span>`
      },
    }
  }

  if (multiple.value) {
    plugins.remove_button = { title: 'Noņemt vērtību' }
  }

  if (props.settings) {
    Object.assign(plugins, props.settings.plugins)
  }

  return plugins
}

const settings: RecursivePartial<TomSettings> = {
  ...props.settings,
  plugins: createPlugins(),
  maxItems: multiple.value ? undefined : 1,
  maxOptions: 250,
  allowEmptyOption: true,
  createFilter: function (input: string) {
    if (!this?.options) return false
    return !(input.toLowerCase() in this.options)
  },
  onChange(selected: string | number | string[]) {
    const newValue = Array.isArray(selected) ? [...selected] : selected
    isEmpty.value = !(typeof selected === 'number') && selected.length === 0
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
    no_results: function (data: TomOption, escape: (str: string) => string) {
      return `<div class="no-results">Netika atrasti rezultāti vaicājumam "${escape(
        data.input
      )}"</div>`
    },
  },
}

const isOptionSelected = (value: string) => {
  return multiple.value
    ? (props.modelValue as string[]).includes(value)
    : (props.modelValue as string) === value
}

const init = () => {
  model.value = new TomSelect(selectRef.value, settings)
}

onMounted(init)

watch(
  () => props.settings?.options,
  (options) => {
    model.value.clearOptions()
    model.value.addOptions(options)
    if (options?.length) model.value.refreshOptions(false)
  }
)
watch(
  () => props.modelValue,
  (value) => model.value.setValue(value, true)
)
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
