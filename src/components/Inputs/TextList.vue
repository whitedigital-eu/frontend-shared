<template>
  <div class="relative" :class="{ 'overflow-hidden': isEmpty && !hasFocus }">
    <div class="flex gap-4 mb-4 relative">
      <FormFieldLabel
        v-if="label"
        :is-placeholder="isEmpty && !hasFocus"
        @click="handleLabelClick"
      >
        {{ props.label }}
      </FormFieldLabel>
      <input
        ref="inputRef"
        v-model="addValue"
        class="appearance-none block form-control sm:min-w-[200px] w-full"
        :class="{ 'sm:min-w-[416px]': long }"
        :readonly="readonly"
        type="text"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <PlusIcon
        class="absolute cursor-pointer right-[8px] top-[50%] translate-y-[-50%]"
        @click="addNewValue"
      />
    </div>
    <div v-if="modelValue && modelValue.length !== 0">
      <div
        v-for="(item, index) in modelValue"
        class="bg-white border border-slate-300 mb-2 p-1 relative rounded-md"
      >
        {{ item }}
        <X
          class="absolute cursor-pointer right-[8px] top-[50%] translate-y-[-50%]"
          @click="() => removeValue(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref, watch } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'
import { StringListValue } from './ValueTypes'
import { PlusIcon, X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: StringListValue
    label?: string | null
    readonly?: boolean
    long?: boolean
  }>(),
  {
    label: null,
    readonly: false,
    long: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: StringListValue] }>()

const handleFocus = () => {
  if (props.readonly) return
  hasFocus.value = true
}
const handleBlur = () => (hasFocus.value = false)

const inputRef = ref<HTMLInputElement | undefined>()
const value: Ref<StringListValue> = ref([])
const hasFocus = ref(false)
const addValue = ref('')
const isEmpty = computed(() => !addValue.value)

const addNewValue = () => {
  if (addValue.value.trim() === '') return
  emit('update:modelValue', [...(props.modelValue as string[]), addValue.value])
  addValue.value = ''
}

const removeValue = (index: number) => {
  if (index === -1) return
  const newModelValue = [...(props.modelValue as string[])]
  newModelValue.splice(index, 1)
  emit('update:modelValue', newModelValue)
}

const handleLabelClick = () => {
  if (props.readonly) return
  inputRef.value?.focus()
}

watch(
  () => props.modelValue,
  (n) => (value.value = n),
  { immediate: true },
)
</script>

<style lang="scss" scoped>
input {
  transition: all 0.2s ease-in-out;
}
</style>
