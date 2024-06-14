<template>
  <div class="relative">
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
      class="form-control input"
      :config="config"
      @on-change="handleChange"
      @on-close="handleClose"
      @on-open="handleOpen"
    />
    <X
      v-if="!isMobile"
      class="absolute cursor-pointer right-2 top-[50%] translate-y-[-50%]"
      @click="clearInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
//@ts-ignore
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import locales from 'flatpickr/dist/l10n/'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import FormFieldLabel from '../FormFieldLabel.vue'
import { areStringArraysEqual } from '../../helpers/Global'
import { X } from 'lucide-vue-next'
import useIsMobile from '../../composables/useIsMobile'
import { getVueCurrentLocale } from '../../helpers/Translations'

const props = withDefaults(
  // TODO: remove '' from allowed values, use null instead
  defineProps<{ modelValue?: string[] | null | ''; label?: string }>(),
  { modelValue: () => [], label: '' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string[] | null] }>()

dayjs.extend(LocalizedFormat)

const { isMobile } = useIsMobile()

const datepickerRef = ref(null)

const value = ref<typeof props.modelValue>(null)

const isEmpty = computed(() => !value.value || value.value.length === 0)
const isOpen = ref(false)

const config: any = {
  altInput: true,
  altFormat: 'D-m-y',
  dateFormat: 'Z',
  enableTime: false,
  time_24hr: true,
  locale: getVueCurrentLocale() === 'lv' ? locales.lv : undefined,
  mode: 'range',
  static: true,
  formatDate: (date: Date) => dayjs(date).format('LL'),
}

const handleChange = (selectedDates: Date[]) => {
  const newVal = selectedDates.map((date: Date) =>
    dayjs(date).format('YYYY-MM-DD'),
  )
  if (
    newVal.length < 2 ||
    (props.modelValue && areStringArraysEqual(newVal, props.modelValue))
  ) {
    return
  }

  emit('update:modelValue', newVal)
}

const handleLabelClick = () => {
  if (!datepickerRef.value) return
  ;(datepickerRef.value as any).$el.nextSibling.focus()
}

const handleOpen = () => (isOpen.value = true)
const handleClose = () => (isOpen.value = false)

watch(
  () => props.modelValue,
  (n) => (value.value = n),
  { immediate: true },
)

const clearInput = () => emit('update:modelValue', [])
</script>
