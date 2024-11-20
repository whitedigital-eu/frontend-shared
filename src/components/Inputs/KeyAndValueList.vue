<template>
  <div class="relative">
    <p v-if="config.labels?.formLabel" class="mb-4">
      {{ config.labels?.formLabel }}
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
            <TextEditor
              v-if="config.keyInputType === 'textarea'"
              :label="config.labels?.keyLabel"
              :model-value="item.key"
              :readonly="config.readonly"
              @update:model-value="
                (newValue) => handleInput('key', index, newValue)
              "
            />
            <Text
              :config="{ readonly: config.readonly }"
              :label="config.labels?.keyLabel"
              :model-value="item.key"
              @update:model-value="
                (newValue) => handleInput('key', index, newValue)
              "
            />
            <TextEditor
              v-if="config.valueInputType === 'textarea'"
              :label="config.labels?.valueLabel"
              :model-value="item.value"
              :readonly="config.readonly"
              @update:model-value="
                (newValue) => handleInput('value', index, newValue)
              "
            />
            <Text
              v-else
              :config="{ readonly: config.readonly }"
              :label="config.labels?.valueLabel"
              :model-value="item.value"
              @update:model-value="
                (newValue) => handleInput('value', index, newValue)
              "
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <button class="btn btn-primary me-1" type="button" @click="addField">
        {{ config.labels?.addField }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { KeyAndValueListValue } from './ValueTypes'
import { X } from 'lucide-vue-next'
import { KeyAndValueArrayFieldConfig } from '../../types/InputFields'
import Text from './Text.vue'
import TextEditor from './TextEditor.vue'

const { modelValue, config } = defineProps<{
  modelValue: KeyAndValueListValue
  config: KeyAndValueArrayFieldConfig
}>()

const emit = defineEmits<{
  'update:modelValue': [value: KeyAndValueListValue]
}>()

const value: Ref<KeyAndValueListValue> = ref([])

const handleInput = (
  type: keyof KeyAndValueListValue[number],
  index: keyof KeyAndValueListValue,
  newValue = '',
) => {
  ;(modelValue[index] as KeyAndValueListValue[number])[type] = newValue
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
  { immediate: true },
)
</script>

<style lang="scss" scoped>
input {
  display: block;
  appearance: none;
  transition: all 0.2s ease-in-out;
}
</style>
