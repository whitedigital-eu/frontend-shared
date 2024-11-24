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
      v-if="!isMobile"
      class="absolute cursor-pointer right-2 top-[50%] translate-y-[-50%]"
      @click="clearInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import FormFieldLabel from '../FormFieldLabel.vue'
import { areStringArraysEqual } from '../../helpers/Global'
import { X } from 'lucide-vue-next'
import useIsMobile from '../../composables/useIsMobile'
import { getDefaultFlatpickrConfig } from './Flatpickr'
import { RangeDatepickerProps } from './PropTypes'
import _ from 'lodash'

const {
  modelValue = null,
  label = null,
  config,
} = defineProps<RangeDatepickerProps>()

const emit = defineEmits<{ 'update:modelValue': [value: string[] | null] }>()

dayjs.extend(LocalizedFormat)

const { isMobile } = useIsMobile()

const datepickerRef = ref(null)

const value = ref<typeof modelValue>(null)

const isEmpty = computed(() => !value.value || value.value.length === 0)
const isOpen = ref(false)

const computedConfig = computed(() =>
  _.merge(
    {
      readonly: false,
      flatpickrConfig: {
        ...getDefaultFlatpickrConfig(),
        altFormat: 'D-m-y',
        enableTime: false,
        mode: 'range',
        formatDate: (date: Date) => dayjs(date).format('LL'),
      },
    },
    config,
  ),
)

const handleChange = (selectedDates: Date[]) => {
  const newVal = selectedDates.map((date: Date) =>
    dayjs(date).format('YYYY-MM-DD'),
  )
  if (
    newVal.length < 2 ||
    (modelValue && areStringArraysEqual(newVal, modelValue))
  ) {
    return
  }

  emit('update:modelValue', newVal)
}

const handleLabelClick = () => {
  if (!datepickerRef.value) return
  ;(
    (datepickerRef.value as { $el: HTMLElement }).$el.nextSibling as HTMLElement
  ).focus()
}

const handleOpen = () => (isOpen.value = true)
const handleClose = () => (isOpen.value = false)

watch(
  () => modelValue,
  (n) => (value.value = n),
  { immediate: true },
)

const clearInput = () => emit('update:modelValue', [])
</script>
