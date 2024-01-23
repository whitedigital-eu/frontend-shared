<template>
  <div class="time-picker">
    <input
      class="form-control w-20"
      :disabled="disabled"
      :max="max"
      min="0"
      :placeholder="placeholder"
      type="number"
      :value="modelValue"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    />
    <select ref="selectRef" class="tom-select">
      <option v-for="(option, i) in options" :key="i" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import TomSelect from 'tom-select'
import { SelectOption } from '../../models/FormFields'

const props = defineProps<{
  modelValue: string | number
  type: 'hours' | 'minutes'
  disabled?: boolean
  step?: number
}>()

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const formatTimeInput = (v: string | number) => {
  const value = v.toString()
  if (value.length === 1) return '0' + value
  if (value.length === 2) return value
  return value.slice(-2)
}

const value = ref(formatTimeInput(props.modelValue))
const selectRef = ref()
const selectModel = ref()

const emitUpdate = () => emit('update:modelValue', parseInt(value.value))

const handleInput = (e: Event) => {
  value.value = formatTimeInput((e.target as HTMLInputElement).value)
  emitUpdate()
}

const handleFocus = () => selectModel.value.open()

const handleBlur = (e: FocusEvent) => {
  selectModel.value.close()
  value.value = formatTimeInput((e.target as HTMLInputElement).value)
  emitUpdate()
}

const selectSettings: any = {
  onChange(selected: string) {
    value.value = formatTimeInput(selected)
    emitUpdate()
  },
  create: false,
}

const isHours = computed(() => props.type === 'hours')
const max = computed(() => (isHours.value ? 23 : 59))
const placeholder = computed(() => (isHours.value ? 'St.' : 'Min.'))

const optionStep = computed(() => {
  if (props.step) return props.step
  return isHours.value ? 1 : 5
})

const createSelectOptions = () => {
  const arr: number[] = []

  for (let i = 0; i <= max.value; i += optionStep.value) arr.push(i)

  return arr.map((item: number) => {
    const formattedItem: string =
      item.toString().length === 1 ? `0${item}` : item.toString()
    return new SelectOption(formattedItem, formattedItem)
  })
}

const options = createSelectOptions()

onMounted(() => {
  selectModel.value = new TomSelect(selectRef.value, selectSettings)
})

watch(
  () => props.modelValue,
  (n) => {
    const newVal: string = formatTimeInput(n)
    if (newVal !== value.value) value.value = newVal
  },
  { immediate: true },
)
</script>

<style>
.time-picker {
  .ts-control {
    display: none;
  }

  .ts-wrapper {
    min-height: 0;
  }

  .ts-input {
    display: none;
  }
}
</style>
