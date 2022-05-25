import { ref } from 'vue'

export default function useResponsivity() {
  const isMobileScreenSize = () =>
    window.matchMedia('(max-width: 767px)').matches

  const isMobile = ref(isMobileScreenSize())

  return { isMobile }
}
