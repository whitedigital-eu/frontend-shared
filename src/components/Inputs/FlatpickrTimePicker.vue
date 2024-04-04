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
        :config="config"
        step="60"
        @on-close="handleClose"
        @on-open="handleOpen"
      />
      <X
        v-if="!isMobile"
        class="absolute cursor-pointer right-[8px] top-[50%] translate-y-[-50%]"
        @click="clearInput"
      />
    </div>
    <input v-else v-model="value" :class="inputClass" step="60" type="time" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
//@ts-ignore
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import locales from 'flatpickr/dist/l10n/'
import { X } from 'lucide-vue-next'

import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import FormFieldLabel from '../FormFieldLabel.vue'
import { FlatpickrTimePickerValue } from './ValueTypes'
import useIsMobile from '../../composables/useIsMobile'

const {
  modelValue = null,
  label = null,
  id = null,
} = defineProps<{
  modelValue?: FlatpickrTimePickerValue
  label?: string | null
  id?: string | null
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

dayjs.extend(LocalizedFormat)

const { isMobile } = useIsMobile()

const computedId = computed(() => {
  if (!id) {
    console.warn('id should be defined! id: ', id)
    return `datepicker-1234`
  }
  return `datepicker-${id}`
})

const flatpickr = ref(null)

const value = ref<string>('')

const isOpen = ref(false)

const isEmpty = computed(() => !value.value)

const inputClass = 'form-control input w-full'

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

  if (modelValue && timeRegex.test(modelValue)) {
    const [hoursStr, minutesStr] = modelValue.split(':')
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
  if (modelValue) setValueFromModelValue()
})

let emitted = false

watch(
  () => modelValue,
  () => {
    if (emitted) {
      emitted = false
      return
    }

    setValueFromModelValue()
  },
)

watch(
  () => value.value,
  (n) => {
    emit('update:modelValue', n)
    emitted = true
  },
)
</script>
