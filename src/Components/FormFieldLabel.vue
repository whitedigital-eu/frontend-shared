<template>
  <label
    :class="computedCssClasses"
    :style="{ transform: `translateY(${computedTranslateY})` }"
  >
    <slot />
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
  const cssClasses = ['placeholder', 'cursor-text']
  if (props.placeholderCssClasses)
    cssClasses.push(...props.placeholderCssClasses)
  return cssClasses
})
</script>

<style lang="scss" scoped>
label {
  position: absolute;
  transition: all 0.2s ease-in-out, background 1ms;
  top: 0;
  left: 8px;
  background: white;
  padding: 1px 4px;
  color: #164e63;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: auto;
  border-radius: 8px;

  &.placeholder {
    font-size: 14px;
    color: #39687b;
    opacity: 0.8;
    left: 12px;
    width: 230px;
    background: transparent;
  }
}
</style>
