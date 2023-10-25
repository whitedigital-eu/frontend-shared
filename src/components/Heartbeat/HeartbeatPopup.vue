<template>
  <Teleport to="body">
    <div
      v-show="shouldShow"
      class="bg-white border border-[#DEE2E6] fixed min-w-[100vw] right-0 rounded-lg shadow-xl sm:min-w-[550px] sm:right-14 sm:top-20 top-0 z-[51]"
      v-bind="$attrs"
    >
      <div class="pl-6 pr-14 py-6 relative">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex gap-4 items-center">
            <div class="p-2 rounded-lg text-white" :class="bgClass">
              <Icon name="AlertCircle" size="28" />
            </div>
            <div class="leading-normal text-base">
              <p>{{ $t('common.heartbeat.textLine1') }}</p>
              <p>{{ $t('common.heartbeat.textLine2') }}</p>
            </div>
          </div>
          <button
            class="disabled:cursor-not-allowed disabled:opacity-50 leading-none px-5 py-3 rounded-md text-sm text-white"
            :class="bgClass"
            :disabled="buttonClicked"
            @click="reloadPage"
          >
            {{ $t('common.heartbeat.buttonText') }}
          </button>
        </div>
        <button
          class="absolute bg-[#E5E5E5] h-6 p-1 right-2.5 rounded-full text-[#4F4F4F] top-2.5 w-6"
          @click="shouldShow = false"
        >
          <Icon name="X" size="16" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '../Icons/Icon.vue'
import { translateWithFallback } from '../../site-tree/Helpers/Translations'

const { t, bgClass } = defineProps<{
  t?: (...args: any[]) => string
  bgClass: string
}>()

const $t = translateWithFallback(t)

const shouldShow = ref(true)

const buttonClicked = ref(false)
const reloadPage = () => {
  buttonClicked.value = true
  window.location.reload()
}
</script>
