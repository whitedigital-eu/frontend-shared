<template>
  <div class="flex gap-2 xl:mt-0">
    <button
      class="btn btn-outline-secondary grow mr-1"
      type="button"
      @click="emit('cancel-click')"
    >
      {{ $t('common.cancel') }}
    </button>
    <LoadingButton
      class="grow"
      :loading="isLoading"
      @click="emit('proceed-click')"
    >
      {{ buttonText }}
    </LoadingButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingButton from '../LoadingButton.vue'
import { translateWithFallback } from '../../site-tree/Helpers/Translations'

const {
  isLoading,
  iri = null,
  t,
} = defineProps<{
  isLoading: boolean
  iri?: string | null
  t?: (...args: any[]) => string
}>()

const emit = defineEmits<{
  'cancel-click': []
  'proceed-click': []
}>()

const $t = translateWithFallback(t)

const buttonText = computed(() =>
  iri ? $t('common.save') : $t('common.create'),
)
</script>
