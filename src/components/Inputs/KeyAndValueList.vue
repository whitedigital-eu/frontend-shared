<template>
  <div class="relative">
    <p class="mb-4">{{ props.text?.form_label ? props.text?.form_label : 'Value and Key form' }}</p>
    <div class="flex gap-4 relative">
      <div v-if="modelValue && modelValue.length !== 0" class="w-full">
        <div
          v-for="(item, index) in modelValue"
          :key="index"
          class="relative"
        >
          <X
            class="absolute cursor-pointer right-0 top-[-18px] w-[16px] z-10"
            @click="removeFields(index)"
          />
          <div class="w-full mb-4 grid grid-cols-2 gap-x-4">
            <div
              class="relative"
              :class="{
                'overflow-hidden': !item.key && hasFocus !== 'key' + index,
              }"
            >
              <FormFieldLabel
                :is-placeholder="!item.key && hasFocus !== 'key' + index"
                @click.native="handleLabelClick"
              >
                {{ props.text?.key_label ? props.text?.key_label : 'Key' }}
              </FormFieldLabel>
              <input
                ref="inputRef"
                v-model="item.key"
                class="form-control sm:min-w-[200px] w-full"
                :class="{ 'sm:min-w-[416px]': long }"
                :readonly="readonly"
                type="text"
                @blur="handleBlur"
                @focus="handleFocus('key', index)"
                @input="handleInput('key', index, $event)"
              />
            </div>
            <div
              class="relative"
              :class="{
                'overflow-hidden':
                  !item.value && hasFocus !== 'value' + index,
              }"
            >
              <FormFieldLabel
                :is-placeholder="!item.value && hasFocus !== 'value' + index"
                @click.native="handleLabelClick"
              >
                {{
                  props.text?.value_label ? props.text?.value_label : 'Value'
                }}
              </FormFieldLabel>
              <input
                ref="inputRef"
                v-model="item.value"
                class="form-control sm:min-w-[200px] w-full"
                :class="{ 'sm:min-w-[416px]': long }"
                :readonly="readonly"
                type="text"
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
      <button class="btn btn-primary me-1" type="button" @click="addFields">
        {{ props.text?.add_field ? props.text?.add_field : 'Add field' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'
import { KeyAndValueList } from './ValueTypes'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: { key: string; value: string }[]
    text?: { key_label: string; value_label: string; add_field: string, form_label: string } | null
    readonly?: boolean
    long?: boolean
  }>(),
  {
    text: null,
    readonly: false,
    long: false,
  }
)
const emit = defineEmits(['update:modelValue'])
const handleFocus = (type: string, index: number) => {
  if (props.readonly) return
  hasFocus.value = type + index
}
const handleBlur = () => (hasFocus.value = '')

const inputRef = ref<HTMLInputElement | undefined>()
const value: Ref<KeyAndValueList> = ref([])
const hasFocus = ref('')

const handleLabelClick = function (event: any) {
  if (props.readonly) return
  event.target.nextElementSibling.focus()
}

const handleInput = (type: string, index: number, event: Event) => {
  (props.modelValue[index] as any)[type] = (event.target as HTMLInputElement).value
  emit('update:modelValue', props.modelValue)
}

const addFields = () => {
  props.modelValue.push({ key: '', value: '' })
}

const removeFields = (index: number) => {
  if (props.modelValue.length > 1) {
    props.modelValue.splice(index, 1)
    emit('update:modelValue', props.modelValue)
  }
}

watch(
  () => props.modelValue,
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
