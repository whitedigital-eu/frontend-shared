<template>
  <component :is="tag" ref="tippyRef">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import tippy, { roundArrow, animateFill } from 'tippy.js'

const {
  content = '',
  tag = 'span',
  options = {},
  refKey = null,
} = defineProps<{
  content?: string
  tag?: string
  options?: Record<any, any>
  refKey?: string | null
}>()

const tippyRef = ref()
const init = () => {
  tippy(tippyRef.value, {
    plugins: [animateFill],
    content,
    arrow: roundArrow,
    popperOptions: {
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            rootBoundary: 'viewport',
          },
        },
      ],
    },
    animateFill: false,
    animation: 'shift-away',
    ...options,
  })
}

const bindInstance = () => {
  if (refKey) {
    const bind = inject(`bind[${refKey}]`)
    if (bind && typeof bind === 'function') {
      bind(tippyRef.value)
    }
  }
}

onMounted(() => {
  init()
  bindInstance()
})
</script>
