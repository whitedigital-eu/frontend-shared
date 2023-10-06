<template>
  <label
    class="absolute overflow-hidden px-1 py-[1px] rounded-lg text-ellipsis top-0 whitespace-nowrap"
    :class="computedCssClasses"
    :data-role="isPlaceholder ? 'placeholder' : 'label'"
    data-testid="form-field-label"
    :style="{ transform: `translateY(${computedTranslateY})` }"
  >
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  isPlaceholder?: boolean
  placeholderCssClasses?: string[]
  titleOffsetTop?: string
}>()

const computedTranslateY = computed(() => {
  if (props.isPlaceholder) return '8px'
  return props.titleOffsetTop ?? '-14px'
})

const labelClasses = 'text-xs w-auto text-teal-900 left-2 bg-white'
const placeholderClasses =
  '!text-[14px] text-teal-800 opacity-[0.8] left-3 w-40 bg-transparent cursor-text'

const computedCssClasses = computed(() => {
  if (!props.isPlaceholder) return labelClasses

  const cssClasses = [placeholderClasses]
  if (props.placeholderCssClasses) {
    cssClasses.push(...props.placeholderCssClasses)
  }
  return cssClasses
})
</script>

<style lang="scss" scoped>
label {
  transition:
    all 0.2s ease-in-out,
    background 1ms,
    visibility 0s;
}
</style>
