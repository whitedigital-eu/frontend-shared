<template>
  <div :id="id" class="relative">
    <FormFieldLabel
      v-if="label"
      class="z-[1]"
      :is-placeholder="!isMobile && isEmpty && !isOpen"
      :placeholder-css-classes="['!cursor-pointer']"
      @click="handleLabelClick"
    >
      {{ label }}
    </FormFieldLabel>
    <FlatPickr
      ref="datepickerRef"
      v-model="value"
      class="form-control input w-full"
      :class="{ 'flatpickr-input-readonly': readonly }"
      :config="config"
      :disabled="readonly"
      @on-change="handleChange"
      @on-close="handleClose"
      @on-open="handleOpen"
    />
    <X
      v-if="!isMobile"
      class="absolute cursor-pointer right-[8px] top-[50%] translate-y-[-50%]"
      @click="clearInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import locales from 'flatpickr/dist/l10n/'
import { X } from 'lucide-vue-next'

import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import FormFieldLabel from '../FormFieldLabel.vue'
import { DatepickerValue } from './ValueTypes'
import useResponsivity from '../../composables/useResponsivity'

const {
  modelValue = null,
  label = null,
  readonly = false,
} = defineProps<{
  modelValue?: DatepickerValue
  label?: string | null
  readonly?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

dayjs.extend(LocalizedFormat)

const { isMobile } = useResponsivity()

const createRandomId = () => Math.floor(100000 + Math.random() * 900000)

const id = `datepicker-${createRandomId()}`

const datepickerRef = ref(null)

const propValueToModelValue = (propValue: string | null) => {
  if (propValue === null || propValue === '') return ''
  if (!dayjs(propValue).isValid()) {
    console.error(
      `Datepicker: modelValue is not a valid date string! modelValue: `,
      propValue
    )
    return undefined
  }
  return propValue
}

const value = ref<string | undefined>(propValueToModelValue(modelValue))

const isEmpty = computed(() => !value.value)
const isOpen = ref(false)

// WARNING: 'any' type is needed here due to vue-flatpickr-component having wrong type definitions
const config: any = {
  altInput: true,
  altFormat: 'D-m-y',
  dateFormat: 'Z',
  enableTime: false,
  time_24hr: true,
  locale: locales.lv,
  static: true,
  formatDate: (date: Date) => dayjs(date).format('LL'),
}

const handleChange = (selectedDates: Date[]) => {
  const emitValue = selectedDates.length
    ? dayjs(selectedDates[0]).format('YYYY-MM-DD')
    : null
  emit('update:modelValue', emitValue)
}

const handleLabelClick = () => {
  if (!datepickerRef.value) return
  ;(datepickerRef.value as any).$el.nextSibling.focus()
}

const handleOpen = () => (isOpen.value = true)
const handleClose = () => (isOpen.value = false)

const clearInput = () => emit('update:modelValue', null)

watch(
  () => modelValue,
  (n) => (value.value = propValueToModelValue(n)),
  { immediate: true }
)

const closeCalendar = () => {
  ;(datepickerRef.value as any).fp.close()
}

const addCloseButtonToDatepicker = () => {
  const buttonDiv = document.createElement('div')
  buttonDiv.classList.add('mt-2', 'pr-2', 'mb-2', 'pl-2', 'pt-2', 'text-right')
  buttonDiv.style.borderTop = '1px solid #e2e8f099'

  const confirmButton = document.createElement('button')
  confirmButton.classList.add('btn', 'btn-primary', 'h-[28px]')
  confirmButton.textContent = 'Aizvērt'
  confirmButton.type = 'button'
  confirmButton.addEventListener('click', closeCalendar)

  buttonDiv.appendChild(confirmButton)

  document.querySelector(`#${id} .flatpickr-calendar`)?.appendChild(buttonDiv)
}

onMounted(addCloseButtonToDatepicker)
</script>

<style lang="scss">
.flatpickr-input-readonly {
  background: #f3f5f6 !important;
}
</style>
