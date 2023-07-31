<template>
  <Tippy
    :options="{
      placement: 'left',
    }"
    ref-key="sideMenuTooltipRef"
    :tag="tag"
  >
    <slot></slot>
  </Tippy>
</template>

<script setup lang="ts">
import { provide, ref, onMounted } from 'vue'
//@ts-ignore
import dom from '@left4code/tw-starter/dist/js/dom'

const { tag = 'span' } = defineProps<{ tag?: string }>()

const tippyRef = ref()

provide('bind[sideMenuTooltipRef]', (el: HTMLElement) => {
  tippyRef.value = el
})

const toggleTooltip = () => {
  const el = tippyRef.value
  if (dom(window).width() <= 1260) {
    el._tippy.enable()
  } else {
    el._tippy.disable()
  }
}

const initTooltipEvent = () => {
  window.addEventListener('resize', () => {
    toggleTooltip()
  })
}

onMounted(() => {
  toggleTooltip()
  initTooltipEvent()
})
</script>
