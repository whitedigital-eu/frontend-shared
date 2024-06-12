import { computed, ComputedRef, nextTick, onMounted, Ref, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { getCompStyle } from '../../../helpers/Dom'

const ratio = 16 / 9

export default function useSignatureDimensions(): {
  isReady: Ref<boolean>
  dimensions: ComputedRef<{ width: string; height: string }>
} {
  const { height: windowHeight } = useWindowSize()

  let gridFormWidth: number | null = null
  let modalHeaderHeight: number | null = null
  let modalFooterHeight: number | null = null
  const isReady = ref(false)

  onMounted(async () => {
    await nextTick()
    gridFormWidth = getCompStyle(
      document.querySelector('[data-role="grid-form"]'),
      'width',
    )
    modalHeaderHeight = getCompStyle(
      document.querySelector('.modal-header'),
      'height',
    )
    modalFooterHeight = getCompStyle(
      document.querySelector('.modal-footer'),
      'height',
    )
    isReady.value = true
  })

  const dimensions = computed(() => {
    if (
      !gridFormWidth ||
      !modalHeaderHeight ||
      !modalFooterHeight ||
      !isReady.value
    ) {
      return { width: '100%', height: '100%' }
    }

    const canvasFooterHeight = 47
    const maxHeight =
      windowHeight.value -
      modalFooterHeight -
      modalHeaderHeight -
      canvasFooterHeight

    let canvasWidth = gridFormWidth - 4
    let canvasHeight = canvasWidth / ratio

    if (canvasHeight > maxHeight) {
      canvasHeight = maxHeight
      canvasWidth = maxHeight * ratio
    }

    return { width: `${canvasWidth}px`, height: `${canvasHeight}px` }
  })

  return { isReady, dimensions }
}
