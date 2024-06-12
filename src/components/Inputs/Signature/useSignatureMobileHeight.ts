import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

export default function () {
  const { height: windowHeight } = useWindowSize()

  const windowHeightOffset = 118
  const height = computed(() => `${windowHeight.value - windowHeightOffset}px`)

  return { height }
}
