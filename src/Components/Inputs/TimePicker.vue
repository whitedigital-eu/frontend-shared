<template>
  <div class="time-picker">
    <input
      :disabled="disabled"
      :value="modelValue"
      type="number"
      :placeholder="placeholder"
      class="w-[70px] form-control"
      min="0"
      :max="max"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="emitUpdate"
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
import { SelectOption as SelectOptionType } from '../../Types/FormData'
import SelectOption from '../../Models/SelectOption'

const props = defineProps<{
  modelValue: string
  type: 'hours' | 'minutes'
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

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

const handleFocus = () => selectModel.value.open()

const handleBlur = (e: InputEvent) => {
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

const createSelectOptions = (): SelectOptionType[] => {
  const arr: number[] = []

  for (let i = 0; i <= max.value; isHours.value ? i++ : (i += 5)) arr.push(i)

  return arr.map((item: number): SelectOptionType => {
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
  { immediate: true }
)
</script>

<style>
.time-picker .ts-control {
  display: none;
}
</style>
