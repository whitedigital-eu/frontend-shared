<template>
  <div class="flex gap-4">
    <Datepicker :id="label" v-model="dateValue" class="grow" :label="label" />
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

const props = defineProps<{
  modelValue: string
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const formatTimeInput = (value: string) => {
  if (value.length === 1) return '0' + value
  if (value.length === 2) return value
  return value.slice(-2)
}

const dateValue = ref<string | null>(props.modelValue ?? null)
const hoursValue = ref(
  props.modelValue ? formatTimeInput(dayjs(props.modelValue).format('H')) : ''
)
const minutesValue = ref(
  props.modelValue ? formatTimeInput(dayjs(props.modelValue).format('mm')) : ''
)

const value = ref<string | null>(props.modelValue ?? null)

const setValue = () => {
  if (!dateValue.value) {
    value.value = null
    hoursValue.value = ''
    minutesValue.value = ''
  } else {
    value.value = dayjs(dateValue.value)
      .hour(hoursValue.value ? parseInt(hoursValue.value) : 0)
      .minute(minutesValue.value ? parseInt(minutesValue.value) : 0)
      .toISOString()
  }
}

watch(dateValue, setValue)
watch(hoursValue, setValue)
watch(minutesValue, setValue)

watch(value, (n) => emit('update:modelValue', n))
</script>