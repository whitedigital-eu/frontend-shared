<template>
  <div class="relative">
    <p class="mb-4">
      {{ props.label ? props.label : 'Multiple text fields' }}
    </p>
    <div class="gap-4 grid grid-cols-2 relative">
      <div v-for="(item, index) in props.labelArray" :key="index">
        <div
          class="relative"
          :class="{
            'overflow-hidden': !props.modelValue[index] && hasFocus !== index,
          }"
        >
          <FormFieldLabel
            :is-placeholder="!props.modelValue[index] && hasFocus !== index"
            @click="handleLabelClick"
          >
            {{ item }}
          </FormFieldLabel>
          <input
            ref="inputRef"
            v-model="value[index]"
            class="appearance-none block form-control sm:min-w-[200px] w-full"
            :class="{ 'sm:min-w-[416px]': long }"
            :readonly="readonly"
            type="text"
            @blur="handleBlur"
            @focus="handleFocus('key', index)"
            @input="handleInput()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'
import { MultipleTextFieldListValue } from './ValueTypes'

const props = withDefaults(
  defineProps<{
    modelValue: MultipleTextFieldListValue
    label?: string | null
    labelArray?: string[] | null
    readonly?: boolean
    long?: boolean
  }>(),
  {
    label: null,
    labelArray: null,
    readonly: false,
    long: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: MultipleTextFieldListValue]
}>()

const inputRef: Ref<HTMLInputElement[]> = ref([])
const value: Ref<MultipleTextFieldListValue> = ref(props.modelValue) // Initialize with props.modelValue
const hasFocus = ref(-1)
const handleFocus = (type: string, index: number) => {
  if (props.readonly) return
  hasFocus.value = index
}

const handleBlur = () => (hasFocus.value = -1)

const handleLabelClick = function (event: any) {
  if (props.readonly) return
  event.target.nextElementSibling.focus()
}

const handleInput = () => {
  inputRef.value.map((input, i) => (value.value[i] = input.value))
  emit('update:modelValue', value.value)
}
</script>

<style lang="scss" scoped>
input {
  transition: all 0.2s ease-in-out;
}
</style>
