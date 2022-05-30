<template>
  <div :id="computedId" class="relative">
    <FormFieldLabel
      v-if="label"
      class="z-[1]"
      :is-placeholder="isEmpty && !isOpen"
      :placeholder-css-classes="['!cursor-pointer']"
      @click="handleLabelClick"
    >
      {{ label }}
    </FormFieldLabel>
    <flatPickr
      ref="datepickerRef"
      v-model="value"
      class="w-full"
      :config="config"
      @onChange="handleChange"
      @onOpen="handleOpen"
      @onClose="handleClose"
    />
    <XIcon
      class="cursor-pointer absolute right-[8px] top-[50%] translate-y-[-50%]"
      @click="clearInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue'
//@ts-ignore
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import locales from 'flatpickr/dist/l10n/'

import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import FormFieldLabel from '../FormFieldLabel.vue'

dayjs.extend(LocalizedFormat)

const props = defineProps<{
  modelValue: PropType<string | null>
  label?: string
  id?: string
}>()

const computedId = computed(() => `datepicker-${props.id}`)

const emit = defineEmits(['update:modelValue'])

const datepickerRef = ref(null)

const value = ref<string | null>(null)

const isEmpty = computed(() => !value.value)
const isOpen = ref(false)

const config = {
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
  () => props.modelValue,
  (n: any) => (value.value = n),
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

  document
    .querySelector(`#${computedId.value} .flatpickr-calendar`)
    ?.appendChild(buttonDiv)
}

onMounted(addCloseButtonToDatepicker)
</script>
