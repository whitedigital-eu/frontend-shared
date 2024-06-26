<template>
  <div :id="id" class="relative">
    <FormFieldLabel
      v-if="label"
      class="z-[1]"
      :is-placeholder="!isMobile && isEmpty && !isOpen"
      :placeholder-css-classes="[
        computedConfig.readonly ? '!cursor-not-allowed' : '!cursor-pointer',
      ]"
      @click="handleLabelClick"
    >
      {{ label }}
    </FormFieldLabel>
    <FlatPickr
      ref="datepickerRef"
      v-model="value"
      class="form-control input w-full"
      :class="{
        '!bg-[#f3f5f6]': computedConfig.readonly,
        'cursor-not-allowed': computedConfig.readonly,
      }"
      :config="computedConfig.flatpickrConfig"
      :disabled="computedConfig.readonly"
      @on-change="handleChange"
      @on-close="handleClose"
      @on-open="handleOpen"
    />
    <X
      v-if="!isMobile && !computedConfig.readonly && !isEmpty"
      class="absolute right-2 top-[50%] translate-y-[-50%]"
      :class="computedConfig.readonly ? 'cursor-not-allowed' : 'cursor-pointer'"
      @click="clearInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { X } from 'lucide-vue-next'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import FormFieldLabel from '../FormFieldLabel.vue'
import { DatepickerProps } from './PropTypes'
import _ from 'lodash'
import useIsMobile from '../../composables/useIsMobile'
import { capitalizeFirstLetter } from '../../helpers/Global'
import { useI18nWithFallback } from '../../helpers/Translations'
import { getDefaultFlatpickrConfig } from './Flatpickr'

const {
  modelValue = null,
  label = null,
  config,
} = defineProps<DatepickerProps>()

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

const { t } = useI18nWithFallback()

const computedConfig = computed(() =>
  _.merge(
    {
      readonly: false,
      flatpickrConfig: {
        ...getDefaultFlatpickrConfig(),
        altFormat: 'D-m-y',
        enableTime: false,
        formatDate: (date: Date) => dayjs(date).format('LL'),
      },
    },
    config,
  ),
)

dayjs.extend(LocalizedFormat)

const { isMobile } = useIsMobile()

const createRandomId = () => Math.floor(100000 + Math.random() * 900000)

const id = `datepicker-${createRandomId()}`

const datepickerRef = ref(null)

const propValueToModelValue = (propValue: string | null) => {
  if (propValue === null || propValue === '') return ''
  if (!dayjs(propValue).isValid()) {
    console.error(
      `Datepicker: modelValue is not a valid date string! modelValue: `,
      propValue,
    )
    return ''
  }
  return propValue
}

const value = ref(propValueToModelValue(modelValue))

const isEmpty = computed(() => !value.value)
const isOpen = ref(false)

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
  { immediate: true },
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
  confirmButton.textContent = capitalizeFirstLetter(t('project.close'))
  confirmButton.type = 'button'
  confirmButton.addEventListener('click', closeCalendar)

  buttonDiv.appendChild(confirmButton)

  document.querySelector(`#${id} .flatpickr-calendar`)?.appendChild(buttonDiv)
}

onMounted(addCloseButtonToDatepicker)
</script>
