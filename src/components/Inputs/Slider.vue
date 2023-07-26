<template>
  <div class="border relative rounded-md">
    <FormFieldLabel v-if="label">
      {{ label }}
    </FormFieldLabel>
    <VueSlider
      v-model="value"
      :disabled="readonly"
      drag-on-click
      :duration="0.1"
      :interval="20"
      marks
    />
  </div>
</template>

<script setup>
// TODO: convert this file to TS!
import { ref, watch } from 'vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import FormFieldLabel from '../FormFieldLabel.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: false,
    default: 0,
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
  label: {
    type: String,
    required: false,
    default: null,
  },
})

// const props = withDefaults(
//   defineProps<{
//     modelValue?: number
//     readonly?: boolean
//     label?: string | null
//   }>(),
//   {
//     modelValue: 0,
//     readonly: false,
//     label: null,
//   }
// )

const emit = defineEmits(['update:modelValue'])

const value = ref(props.modelValue)

watch(value, (n) => emit('update:modelValue', n))
watch(
  () => props.modelValue,
  (n) => (value.value = n)
)
</script>

<style lang="scss" scoped>
div {
  padding: 10px 20px 28px 16px;
}
</style>
