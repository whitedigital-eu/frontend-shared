<template>
  <div :id="computedId" class="relative">
    <FormFieldLabel
      v-if="label"
      class="z-[1]"
      :is-placeholder="!isMobile && isEmpty && !isOpen"
      @click="handleLabelClick"
    >
      {{ label }}
    </FormFieldLabel>
    <div v-if="!isMobile">
      <flatPickr
        ref="flatpickr"
        v-model="value"
        :class="inputClass"
        step="60"
        :config="config"
        @on-open="handleOpen"
        @on-close="handleClose"
      />
      <XIcon
        v-if="!isMobile"
        class="cursor-pointer absolute right-[8px] top-[50%] translate-y-[-50%]"
        @click="clearInput"
      />
    </div>
    <input v-else v-model="value" type="time" step="60" :class="inputClass" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
//@ts-ignore
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import locales from 'flatpickr/dist/l10n/'

import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import FormFieldLabel from '../FormFieldLabel.vue'
import { FlatpickrTimePickerValue } from './ValueTypes'
import useResponsivity from '../../composables/useResponsivity'

dayjs.extend(LocalizedFormat)

const props = withDefaults(
  defineProps<{
    modelValue: FlatpickrTimePickerValue
    label?: string | null
    id?: string | null
  }>(),
  {
    modelValue: null,
    label: null,
    id: null,
  }
)

const { isMobile } = useResponsivity()

const computedId = computed(() => {
  if (!props.id) {
    console.warn('props.id should be defined! props.id: ', props.id)
    return `datepicker-1234`
  }
  return `datepicker-${props.id}`
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const flatpickr = ref(null)

const value = ref<string>('')

const isOpen = ref(false)

const isEmpty = computed(() => !value.value)

const inputClass = ref('form-control input w-full')

const handleLabelClick = () => {
  if (!flatpickr.value) return
  ;(flatpickr.value as any).$el.nextSibling.focus()
}

const config: any = {
  altInput: true,
  dateFormat: 'Z',
  enableTime: true,
  time_24hr: true,
  locale: locales.lv,
  static: true,
  noCalendar: true,
  formatDate: (date: Date) => dayjs(date).format('H:mm'),
}

const handleOpen = () => (isOpen.value = true)
const handleClose = () => (isOpen.value = false)

const clearInput = () => (value.value = '')

const parseModelValue = () => {
  let hours = 0
  let minutes = 0
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // H:mm or HH:mm

  if (props.modelValue && timeRegex.test(props.modelValue)) {
    const [hoursStr, minutesStr] = props.modelValue.split(':')
    hours = parseInt(hoursStr)
    minutes = parseInt(minutesStr)
  }

  return { hours, minutes }
}

const setValueFromModelValue = () => {
  let date = dayjs()
  const { hours, minutes } = parseModelValue()
  date = date.hour(hours)
  date = date.minute(minutes)
  value.value = isMobile.value ? date.format('HH:mm') : date.toISOString()
}

onMounted(() => {
  if (props.modelValue) setValueFromModelValue()
})

let emitted = false

watch(
  () => props.modelValue,
  () => {
    if (emitted) {
      emitted = false
      return
    }

    setValueFromModelValue()
  }
)

watch(
  () => value.value,
  (n) => {
    emit('update:modelValue', n)
    emitted = true
  }
)
</script>
