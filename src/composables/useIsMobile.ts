import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'

export default function useIsMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = computed(() => breakpoints.smallerOrEqual('sm').value)
  return { isMobile }
}
