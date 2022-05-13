<template>
  <div class="relative border-[1px] rounded-[6px]">
    <FormFieldLabel>
      {{ label }}
    </FormFieldLabel>
    <VueSlider
      v-model="value"
      :interval="20"
      drag-on-click
      :duration="0.1"
      :marks="true"
      :disabled="readonly"
    />
  </div>
</template>

<script setup lang="ts">
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
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const value = ref(0)

watch(value, (n) => emit('update:modelValue', n))
watch(
  () => props.modelValue,
  (n) => (value.value = n as number),
  { immediate: true }
)
</script>

<style lang="scss" scoped>
div {
  padding: 10px 20px 28px 16px;
}
</style>
