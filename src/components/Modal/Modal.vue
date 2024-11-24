<template>
  <Teleport to="body">
    <div
      aria-hidden="false"
      class="modal overflow-y-auto"
      :class="{ show: visible }"
      tabindex="-1"
      v-bind="$attrs"
      @keydown.esc="handleCloseClick"
    >
      <div
        class="modal-dialog"
        :class="sizeClass"
        :style="[customWidth ? `width: ${customWidth}px` : '']"
      >
        <div class="modal-content relative">
          <section ref="header" class="bg-white modal-header rounded-md z-[5]">
            <slot name="header"></slot>
            <a
              v-if="showClose"
              class="cursor-pointer ml-auto"
              data-test="modal-close-btn"
              @click="handleCloseClick"
            >
              <Icon class="h-8 text-slate-400 w-8" name="X" />
            </a>
          </section>
          <section
            class="modal-body overflow-y-auto py-0"
            :class="bodyClass"
            :style="computedBodyStyle"
          >
            <slot name="body"></slot>
          </section>
          <section
            v-if="showFooter"
            ref="footer"
            class="bg-white modal-footer rounded-md w-full z-[9]"
          >
            <slot name="footer"></slot>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import useModalBodyHeight from './useModalBodyHeight'
import { ModalSize } from '../../types/AccordionLayout'
import Icon from '../Icons/Icon.vue'
import { isMobile } from 'helper-js'

const props = withDefaults(
  defineProps<{
    size?: ModalSize
    showClose?: boolean
    customWidth?: number | null
    bodyClass?: string | string[] | Record<string, boolean> | null
    showFooter?: boolean
  }>(),
  {
    size: null,
    showClose: true,
    customWidth: null,
    bodyClass: null,
    showFooter: true,
  },
)

const emit = defineEmits<{ (e: 'close'): void }>()
const header = ref<HTMLElement>()
const footer = ref<HTMLElement>()

const bodyHeight = useModalBodyHeight(header, footer)

const isMob = isMobile()
const computedBodyStyle = computed(() =>
  isMob ? `height: ${bodyHeight.value}px;` : '',
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return `modal-sm`
    case 'lg':
      return `modal-lg`
    case 'xl':
      return `modal-xl`
    case 'full':
      return `modal-full`
    case 'fit':
      return `modal-fit`
    case 'cover':
      return 'modal-cover'
    default:
      return ''
  }
})

const visible = ref(false)

const handleCloseClick = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 400)
}

const disableBodyScroll = () => {
  document.querySelector('body')!.style.overflow = 'hidden'
}
const enableBodyScroll = () => {
  document.querySelector('body')!.style.overflow = 'auto'
}
onMounted(() => {
  setTimeout(() => {
    visible.value = true
  }, 0)
  disableBodyScroll()
})
onBeforeUnmount(() => {
  enableBodyScroll()
})
</script>

<style lang="scss" scoped>
/* styles that would be added to modal automatically if it was opened
by clicking on element with data-tw-toggle="modal" attribute */
.modal {
  display: block;
  margin-top: 0;
  margin-left: 0;
  z-index: 10000;
  visibility: visible;
  opacity: 0;
  transition: opacity 0.4s ease-in-out 0s;

  &.show {
    opacity: 1;
  }
}

.modal-dialog {
  transition: margin-top 0.4s;
  margin-top: -4rem;

  .show {
    margin-top: 4rem;
  }
}

@media (max-width: 767px) {
  .modal {
    .modal-dialog {
      width: 100%;
      margin-top: 0;
      margin-bottom: 0;
    }
    .modal-content {
      border-radius: 0;
      height: max(100vh, 100%);
    }

    &.show {
      .modal-dialog {
        margin-top: 0;
      }
    }
  }
}

.modal-full {
  width: calc(100% - 64px) !important;
}

@media (min-width: 768px) {
  .modal-fit {
    width: fit-content !important;
  }
}

.modal-cover {
  margin: 0 !important;
  width: 100% !important;
}
</style>
