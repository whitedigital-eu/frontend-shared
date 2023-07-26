<template>
  <div class="relative">
    <p class="mb-4">
      {{ texts?.formLabel ?? 'Value and Key form' }}
    </p>
    <div class="flex gap-4 relative">
      <div v-if="modelValue?.length !== 0" class="w-full">
        <div v-for="(item, index) in modelValue" :key="index" class="relative">
          <X
            v-if="modelValue.length > 1"
            class="absolute cursor-pointer right-0 top-[-18px] w-4 z-10"
            @click="removeFields(index)"
          />
          <div class="gap-x-4 grid grid-cols-2 mb-4 w-full">
            <div
              class="relative"
              :class="{
                'overflow-hidden': !item.key && hasFocus !== 'key' + index,
              }"
            >
              <FormFieldLabel
                :is-placeholder="!item.key && hasFocus !== 'key' + index"
                @click="handleLabelClick"
              >
                {{ texts?.keyLabel ?? 'Key' }}
              </FormFieldLabel>
              <input
                ref="inputRef"
                v-model="item.key"
                class="form-control sm:min-w-[200px] w-full"
                :class="{ 'sm:min-w-[416px]': long }"
                :readonly="readonly"
                type="texts"
                @blur="handleBlur"
                @focus="handleFocus('key', index)"
                @input="handleInput('key', index, $event)"
              />
            </div>
            <div
              class="relative"
              :class="{
                'overflow-hidden': !item.value && hasFocus !== 'value' + index,
              }"
            >
              <FormFieldLabel
                :is-placeholder="!item.value && hasFocus !== 'value' + index"
                @click="handleLabelClick"
              >
                {{ texts?.valueLabel ?? 'Value' }}
              </FormFieldLabel>
              <input
                ref="inputRef"
                v-model="item.value"
                class="form-control sm:min-w-[200px] w-full"
                :class="{ 'sm:min-w-[416px]': long }"
                :readonly="readonly"
                type="texts"
                @blur="handleBlur"
                @focus="handleFocus('value', index)"
                @input="handleInput('value', index, $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <button class="btn btn-primary me-1" type="button" @click="addField">
        {{ texts?.addField ?? 'Add field' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'
import { KeyAndValueListValue } from './ValueTypes'
import { X } from 'lucide-vue-next'
import { LabelProps } from '../../types/InputFields'

const {
  modelValue,
  texts = null,
  readonly = false,
  long = false,
} = defineProps<{
  modelValue: KeyAndValueListValue
  texts?: LabelProps | null
  readonly?: boolean
  long?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const handleFocus = (type: string, index: number) => {
  if (readonly) return
  hasFocus.value = type + index
}
const handleBlur = () => (hasFocus.value = '')

const inputRef = ref<HTMLInputElement | undefined>()
const value: Ref<KeyAndValueListValue> = ref([])
const hasFocus = ref('')

const handleLabelClick = (event: Event) => {
  if (readonly) return
  ;((event.target as HTMLElement).nextElementSibling as HTMLElement).focus()
}

const handleInput = (
  type: keyof KeyAndValueListValue[number],
  index: keyof KeyAndValueListValue,
  event: Event
) => {
  ;(modelValue[index] as KeyAndValueListValue[number])[type] = (
    event.target as HTMLInputElement
  ).value
  emit('update:modelValue', modelValue)
}

const addField = () => {
  emit('update:modelValue', [...modelValue, { key: '', value: '' }])
}

const removeFields = (index: number) => {
  if (modelValue.length > 1) {
    const modelValueCopy = [...modelValue]
    modelValueCopy.splice(index, 1)
    emit('update:modelValue', modelValueCopy)
  }
}

watch(
  () => modelValue,
  (n) => (value.value = n),
  { immediate: true }
)
</script>

<style lang="scss" scoped>
input {
  display: block;
  appearance: none;
  transition: all 0.2s ease-in-out;
}
</style>
