<template>
  <label
    class="absolute bg-white left-2 overflow-hidden px-1 py-[1px] rounded-lg text-ellipsis text-teal-900 text-xs top-0 w-auto whitespace-no-wrap"
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

const computedCssClasses = computed(() => {
  if (!props.isPlaceholder) return null
  const cssClasses = [
    'text-sm text-teal-700 opacity-[0.8] left-3 w-40 bg-transparent cursor-text',
  ]
  if (props.placeholderCssClasses) {
    cssClasses.push(...props.placeholderCssClasses)
  }
  return cssClasses
})
</script>

<style lang="scss" scoped>
label {
  transition: all 0.2s ease-in-out, background 1ms, visibility 0s;
}
</style>
