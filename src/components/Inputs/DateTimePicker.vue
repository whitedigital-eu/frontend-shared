<template>
  <div class="flex gap-4">
    <Datepicker v-model="dateValue" class="grow" :label="label" />
    <TimePicker v-model="hoursValue" :disabled="!value" type="hours" />
    <span class="leading-9">:</span>
    <TimePicker
      v-model="minutesValue"
      :disabled="!value || !hoursValue"
      type="minutes"
    />
  </div>
</template>

<script lang="ts" setup>
import Datepicker from './Datepicker.vue'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import TimePicker from './TimePicker.vue'
import { DateTimePickerValue } from './ValueTypes'

const props = withDefaults(
  defineProps<{
    modelValue: DateTimePickerValue
    label?: string | null
  }>(),
  {
    modelValue: null,
    label: null,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const formatTimeInput = (value: string) => {
  if (value.length === 1) return '0' + value
  if (value.length === 2) return value
  return value.slice(-2)
}

const dateValue = ref<string | null>(props.modelValue)
const hoursValue = ref(
  props.modelValue ? formatTimeInput(dayjs(props.modelValue).format('H')) : ''
)
const minutesValue = ref(
  props.modelValue ? formatTimeInput(dayjs(props.modelValue).format('mm')) : ''
)

const value = ref<string | null>(props.modelValue)

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
  dateValue.value = props.modelValue
  hoursValue.value = props.modelValue
    ? formatTimeInput(dayjs(props.modelValue).format('H'))
    : ''
  minutesValue.value = props.modelValue
    ? formatTimeInput(dayjs(props.modelValue).format('mm'))
    : ''
}

watch(dateValue, setValue)
watch(hoursValue, setValue)
watch(minutesValue, setValue)

watch(value, (n) => emit('update:modelValue', n))

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue === value.value) return

    setDateHoursAndMinutes()
  }
)
</script>
