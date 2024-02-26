<template>
  <div class="flex flex-wrap gap-x-4 gap-y-2">
    <Datepicker v-model="dateValue" class="grow" :label="label" />
    <div class="flex flex-1 flex-nowrap gap-4">
      <TimePicker
        v-model="hoursValue"
        :disabled="!value && (value as unknown as number) !== 0"
        :step="config?.hoursStep"
        type="hours"
      />
      <span class="leading-9">:</span>
      <TimePicker
        v-model="minutesValue"
        :disabled="!value || !hoursValue"
        :step="config?.minutesStep"
        type="minutes"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Datepicker from './Datepicker.vue'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import TimePicker from './TimePicker.vue'
import { DateTimePickerValue } from './ValueTypes'

const {
  modelValue = null,
  label = null,
  config = null,
} = defineProps<{
  modelValue?: DateTimePickerValue
  label?: string | null
  config?: { hoursStep?: number; minutesStep?: number } | null
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

const formatTimeInput = (value: string) => {
  if (value.length === 1) return '0' + value
  if (value.length === 2) return value
  return value.slice(-2)
}

const dateValue = ref<string | null>(modelValue)
const hoursValue = ref(
  modelValue ? formatTimeInput(dayjs(modelValue).format('H')) : '',
)
const minutesValue = ref(
  modelValue ? formatTimeInput(dayjs(modelValue).format('mm')) : '',
)

const value = ref<string | null>(modelValue)

const setValue = () => {
  if (!dateValue.value) {
    value.value = null
    hoursValue.value = ''
    minutesValue.value = ''
  } else {
    value.value = dayjs(dateValue.value)
      .hour(hoursValue.value ? parseInt(hoursValue.value) : 0)
      .minute(minutesValue.value ? parseInt(minutesValue.value) : 0)
      .second(0)
      .toISOString()
  }
}

const setDateHoursAndMinutes = () => {
  dateValue.value = modelValue
  hoursValue.value = modelValue
    ? formatTimeInput(dayjs(modelValue).format('H'))
    : ''
  minutesValue.value = modelValue
    ? formatTimeInput(dayjs(modelValue).format('mm'))
    : ''
}

watch(dateValue, setValue)
watch(hoursValue, setValue)
watch(minutesValue, setValue)

watch(value, (n) => emit('update:modelValue', n))

watch(
  () => modelValue,
  () => {
    if (modelValue === value.value) return

    setDateHoursAndMinutes()
  },
)
</script>
