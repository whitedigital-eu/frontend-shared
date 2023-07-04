<template>
  <div class="relative">
    <div class="flex gap-4 relative">
      <div v-if="modelValue && modelValue.length !== 0" class="w-full">
        <div v-for="(fact, index) in modelValue" :key="index">
          <div
            class="mb-4 relative"
            :class="{
              'overflow-hidden': !fact.title && hasFocus !== 'title' + index,
            }"
          >
            <FormFieldLabel
              v-if="label"
              :is-placeholder="!fact.title && hasFocus !== 'title' + index"
              @click.native="handleLabelClick"
            >
              {{ props.label }} Nr.{{ index + 1 }}
            </FormFieldLabel>
            <input
              :id="'fact-single-title-' + index"
              ref="inputRef"
              v-model="fact.title"
              class="form-control sm:min-w-[200px] w-full"
              :class="{ 'sm:min-w-[416px]': long }"
              :readonly="readonly"
              type="text"
              @blur="handleBlur"
              @focus="handleFocus('title', index)"
              @input="handleInput('title', index, $event)"
            />
          </div>
          <div
            class="mb-4 relative"
            :class="{
              'overflow-hidden': !fact.text && hasFocus !== 'text' + index,
            }"
          >
            <FormFieldLabel
              v-if="label"
              :is-placeholder="!fact.text && hasFocus !== 'text' + index"
              @click.native="handleLabelClick"
            >
              {{ props.label_two }} Nr.{{ index + 1 }}
            </FormFieldLabel>
            <input
              :id="'fact-single-value-' + index"
              ref="inputRef"
              v-model="fact.text"
              class="form-control sm:min-w-[200px] w-full"
              :class="{ 'sm:min-w-[416px]': long }"
              :readonly="readonly"
              type="text"
              @blur="handleBlur"
              @focus="handleFocus('text', index)"
              @input="handleInput('text', index, $event)"
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <button class="btn btn-primary me-1" type="button" @click="addFields">
        Add field
      </button>
      <button class="btn btn-primary" type="button" @click="removeFields">
        Remove field
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'
import { TitleAndTextList } from './ValueTypes'

const props = withDefaults(
  defineProps<{
    modelValue: TitleAndTextList
    label?: string | null
    label_two?: string | null
    readonly?: boolean
    long?: boolean
  }>(),
  {
    label: null,
    label_two: null,
    readonly: false,
    long: false,
  }
)

const emit = defineEmits(['update:modelValue'])

const handleFocus = (type, index) => {
  if (props.readonly) return
  hasFocus.value = type + index
}
const handleBlur = () => (hasFocus.value = '')

const inputRef = ref<HTMLInputElement | undefined>()
const value: Ref<TitleAndTextList> = ref([])
const hasFocus = ref('')

const handleLabelClick = function (event) {
  if (props.readonly) return
  event.target.nextElementSibling.focus()
}

const handleInput = (type, index, event) => {
  props.modelValue[index][type] = event.target.value
  emit('update:modelValue', props.modelValue)
}

const addFields = () => {
  props.modelValue.push({ title: '', text: '' })
}

const removeFields = () => {
  if (props.modelValue.length > 1) {
    props.modelValue.pop()
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
