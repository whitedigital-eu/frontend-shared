import { nextTick, onBeforeUnmount, onMounted, Ref, ref } from 'vue'
import { getCompStyle, observeEl } from '../../helpers/Dom'

export default function useModalBodyHeight(
  header: Ref<HTMLElement | undefined>,
  footer: Ref<HTMLElement | undefined>,
): Ref<number> {
  const bodyHeight = ref(window.innerHeight)

  const computeHeight = () => {
    nextTick(() => {
      const headerHeight = getCompStyle(header.value, 'height')
      const footerHeight = getCompStyle(footer.value, 'height')
      const extraOffset = 32
      bodyHeight.value =
        window.innerHeight -
        (headerHeight ?? 0) -
        (footerHeight ?? 0) -
        extraOffset
    })
  }

  onMounted(() => {
    computeHeight()
    window.addEventListener('resize', computeHeight)
    screen.orientation.addEventListener('change', computeHeight)
    observeEl(header.value, computeHeight)
    observeEl(footer.value, computeHeight)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', computeHeight)
    screen.orientation.removeEventListener('change', computeHeight)
  })

  return bodyHeight
}
