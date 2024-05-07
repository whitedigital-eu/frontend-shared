<template>
  <div class="relative">
    <FormFieldLabel
      v-if="props.label"
      class="z-[2]"
      :is-placeholder="isEmpty && !isOpen"
      :placeholder-css-classes="[
        '!cursor-pointer',
        computedConfig.readonly ? '!z-[1]' : 'z-[2]',
      ]"
      @click="handleLabelClick"
    >
      {{ props.label }}
    </FormFieldLabel>
    <select
      :id="selectId"
      ref="selectRef"
      class="tom-select"
      :disabled="computedConfig.readonly"
      :multiple="multiple"
    >
      <option value=""></option>
      <option
        v-for="(option, i) in settings.options"
        :key="i"
        :selected="isOptionSelected(option.value ?? '')"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number">
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue'
import TomSelect from 'tom-select'
import 'tom-select/dist/css/tom-select.css'
import FormFieldLabel from '../../FormFieldLabel.vue'
import { createElement, Users, Phone, Video, Mail } from 'lucide'
import type {
  RecursivePartial,
  TomOption,
  TomSettings,
  TomTemplate,
} from 'tom-select/src/types'
import _ from 'lodash'
import { SelectConfig } from '../../../types/InputFields'

type ModelValue = T | T[] | null

const props = withDefaults(
  defineProps<{
    config?: SelectConfig<T> | null
    modelValue?: ModelValue
    id: string
    label?: string | null
    searchInputPlaceholder?: string
  }>(),
  {
    modelValue: null,
    label: null,
    searchInputPlaceholder: '',
    config: null,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | number]
  'create-new-item': [itemName: string | undefined]
}>()

const defaultConfig: SelectConfig<T> = {
  readonly: false,
  allowDelete: true,
  openInstantly: false,
  dynamicDropDown: true,
  dynamicDropDownMargin: 40,
  tomSelectSettings: { create: false },
}

const computedConfig = computed(() =>
  _.merge({ ...defaultConfig }, props.config ?? {}),
)

const selectRef = ref<HTMLSelectElement>()
const model = ref<TomSelect>()
const selectId = computed(() => `tom-select-${props.id}`)
const multiple = computed(() => Array.isArray(props.modelValue))

const isOpen = ref(false)
const isEmpty = ref(false)

const handleLabelClick = () => {
  if (!model.value || computedConfig.value.readonly || isOpen.value) return
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
  escape: (str: string) => string,
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
  maybeKeyOfIconMapping: string,
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
  if (computedConfig.value.allowDelete) {
    plugins.clear_button = {
      title: 'Dzēst',
      html: function (data: { className: string; title: string }) {
        return `<span class="text-xl !right-2 ${data.className}" title="${data.title}">&#10005;</span>`
      },
    }
  }

  if (multiple.value) {
    plugins.remove_button = { title: 'Noņemt vērtību' }
  }

  if (computedConfig.value.tomSelectSettings) {
    Object.assign(plugins, computedConfig.value.tomSelectSettings.plugins)
  }

  return plugins
}

const defaultSettings: RecursivePartial<TomSettings> = {
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
        data.input,
      )}"</div>`
    },
  },
}

const settings = computed(() =>
  _.merge({ ...defaultSettings }, computedConfig.value.tomSelectSettings),
)

const isOptionSelected = (value: string) => {
  return multiple.value
    ? (props.modelValue as string[]).includes(value)
    : (props.modelValue as string) === value
}

const onDropdownClose = (e: any) => {
  e.style.top = null
}
const onDropdownOpen = () => {
  if (
    !model.value ||
    !model.value.dropdown ||
    !computedConfig.value.dynamicDropDownMargin
  ) {
    return
  }

  const spaceBottom =
    window.innerHeight - model.value.control.getBoundingClientRect().top

  if (
    model.value.dropdown.offsetHeight +
      computedConfig.value.dynamicDropDownMargin >
    spaceBottom
  ) {
    model.value.dropdown.style.top = `-${model.value.dropdown.offsetHeight - 2}px`
  } else {
    model.value.dropdown.style.top = ''
  }
}

const init = () => {
  if (!selectRef.value) return
  /* structuredClone would be better, but doesn't work on refs
   * the settings need to be cloned, because they are modified inside the TomSelect instance */
  const clonedSettings = JSON.parse(JSON.stringify(settings.value))
  model.value = new TomSelect(selectRef.value, clonedSettings)
  if (computedConfig.value.openInstantly) {
    model.value.open()
  }

  if (computedConfig.value.dynamicDropDown) {
    const events = ['dropdown_open', 'type', 'load', 'item_add', 'item_remove']

    events.forEach((event) => {
      if (!model.value) {
        return
      }
      model.value.on(event, onDropdownOpen)
    })

    model.value.on('dropdown_close', onDropdownClose)
  }
}

onMounted(init)

watch(
  () => computedConfig.value.tomSelectSettings?.options,
  (options) => {
    if (!model.value) return
    model.value.clearOptions()
    model.value.addOptions(options ?? [])
    if (options?.length) model.value.refreshOptions(false)
  },
)
watch(
  () => props.modelValue,
  (value) => {
    if (!model.value) return
    value === null
      ? model.value.clear()
      : model.value.setValue(value as string | string[], true)
  },
)
watch(
  () => props.modelValue,
  () =>
    (isEmpty.value =
      !props.modelValue ||
      (!!props.modelValue && (props.modelValue as string).length === 0)),
  { immediate: true },
)
watch(
  () => computedConfig.value.readonly,
  (n) => {
    if (!model.value) return
    n ? model.value.disable() : model.value.enable()
  },
)

onBeforeUnmount(() => {
  if (!model.value) return
  model.value.clearActiveItems()
  model.value.clearOptions()
  model.value.destroy()
})
</script>

<style>
.ts-control {
  min-height: 38px;
}

.ts-select {
  background-color: white;
}
</style>
